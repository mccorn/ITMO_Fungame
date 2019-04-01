const port = 80;
const PAUSE = 5000;

var express = require('express');
var model = require('./model/model.js');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
server.listen(port, function() {
  console.log('Запускаю сервер на порте ' + port);
});


let inx = 0;
let messages = [];


// Реакции на сообщения
io.on('connection', function(socket) {
  socket.on('new user', function() {
    console.log('New user with id ' + socket.id);
    model.addViewer({
      id: socket.id,
      nickname: model.generateNickname(),
    });
    if (model.status == 100) {
      io.sockets.emit('game wait', model);
    } else {
      console.log('game start - 1 - ' + model.status);
      socket.emit('game start', model);
    }
    io.sockets.emit('userslist change', model);
  });
  
  socket.on('user want play', function(flag) {
    if (model.players.indexOf(model.getUser(socket.id)) === -1 && model.players.length < model.MAXPLAYERSCOUNT && flag) {
      let nick = model.getNickname(socket.id);
      model.deleteViewer(socket.id);
      model.addPlayer({
        id: socket.id,
        x: (inx * 10 + 20),
        y: 50,
        width: 7,
        style: model.STYLES[inx++ % 5],
        isDied: false,
        nickname: nick || model.generateNickname(),
      });
      console.log('Add player with id ' + socket.id);
      socket.emit('user registrated', true);
    } else if (model.players.indexOf(model.getUser(socket.id)) === -1){
      console.log(model.players.indexOf(model.getUser(socket.id)));
      model.addViewer({
        id: socket.id,
        nickname: model.getNickname(),
      });
      console.log('Add viewer with id ' + socket.id);
      socket.emit('user registrated', false);
    }
    if (model.status == 100) io.sockets.emit('game wait', model);
    if (model.players.length == model.MAXPLAYERSCOUNT) startGame(model);
  });
  
  socket.on('player move', function(data) {
    var player = model.getUser(socket.id) || {};
    if (player.isDied) return;
    const step = 3;
    switch (data) {
      case 65: // A
        player.x = (player.x >= step) ? player.x - step : 0;
        break;
      case 68: // D
        player.x = (player.x < 100 - player.width - step) ? player.x + step : 100 - player.width;
        break;
    }
  });
  
  socket.on('user new message', function(data) {
    console.log('New message by id ' + socket.id);
    messages.push({
      author_id: socket.id,
      text: data
    });
    io.sockets.emit('chat new message', {
      author: model.getNickname(socket.id), 
      text: data,
    });
  });
  
  socket.on('disconnect', function() {
    console.log('disconnect: ' + socket.id);
    model.deleteUser(socket.id);
    console.log(io.sockets.adapter.sids);
    if (!io.engine.clientsCount) {
      console.log('All off');
      isGameWait = 100;
      model.init();
      return;
    } 
    if (model.status==200 && io.engine.clientsCount && model.hunter.targets >= model.players.length) {
      console.log('change model.status - ' + model.hunter.targets + '-' + model.players.length);
      model.status = 300;
      io.sockets.emit('game over', );
    }
    if (model.status == 100) 
      io.sockets.emit('game wait', model); 
    io.sockets.emit('userslist change', model);
  });
});

function startGame(somemodel) {
  io.sockets.emit('game ready', PAUSE);
  model.status = 200;
  setTimeout(function() {
    console.log('game start - 2 startGame');
    io.sockets.emit('game start', model);
    setTimeout(function() {
      let timerHunterMove = setInterval(function() {
        model.hunter.move();
      }, 1000 / 20);
      let timerHunterAtack = setInterval(function() {
        io.sockets.emit('shot', model.hunter.x);
        let died = model.hunter.atack(model.players);
        console.log(died);
        for(let key in died) {
          model.killPlayer(died[key]);
        }
        if (model.hunter.targets >= model.players.length) {
          console.log('model.hunter.targets - ' + model.hunter.targets);
          console.log('model.players.length - ' + model.players.length);
          clearInterval(timerHunterMove);
          clearInterval(timerHunterAtack);
          io.sockets.emit('game state', model);
          io.sockets.emit('game over', model); 
          console.log('change model.status - ' + model.status);
          model.status = 300;
          setTimeout(function() {
            model.status = 100;
            model.viewers = model.viewers.concat(model.players);
            model.players = [];
            model.hunter.targets = 0;
            io.sockets.emit('game wait', model);  
          }, 5000)  
        }
      }, 3000);  
    }, 3000);
  }, PAUSE + 500);
}

function setPlayers() {
  io.sockets.emit('game wait', model);
}

function getGame() {
  io.sockets.emit('game state', model);
}

let timerMain = setInterval(function() {
  if (model.status == 200){
    getGame();  
  }
}, 1000 / 30)

let timerMain_2 = setTimeout(function() {
  if (model.status == 100){
    setPlayers();  
  }
}, 1200);

//setInterval(function() {
//  console.log('status: ' + model.status);
//}, 3000)