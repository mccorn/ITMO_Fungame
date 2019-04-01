//  localhost:5000/static/
var socket = io();
let counter = 1;
let counter2 = 1;

//Начальные действия

//Подготовка обработчиков
window.onload = function() {
  socket.emit('new user');
}

window.onunload = function() {
  socket.emit('disconnect');
}

//Реакция на сообщения 
socket.on('game resolution', function() {
//  let flag = confirm('Хотите зарегистрироваться как игрок?');
  console.log('game resolution');
  socket.emit('user want play', );
});

socket.on('game wait', function(somemodel) {
//  console.log('');
  console.log('game wait');
  View.showScreen('.screen_waiting', true);
  View.renderWList(somemodel);
});

socket.on('game state', function(users) {
//  console.dir(users);
  console.log('game state');
  users.myID = socket.id;
  View.render(users);
});

socket.on('game ready', function(time) {
  console.log('game ready');
  View.showScreen('.screen_countdown');
  View.printCountdown(time);
});

socket.on('game start', function(users) {
  console.log('game start');
  View.deleteCountdown();
  View.showScreen('.screen_play', true);
  users.myID = socket.id;
  View.renderPList(users);
});

socket.on('game restarted', function(time) {
  console.log('game restarted');
  View.hideModalMessage();
  View.showScreen('.screen_waiting');
  socket.emit('new user');
});
  
socket.on('user registrated', function(flag) {
  console.log('user registrated - ' + flag);
  if(flag) document.addEventListener('keydown', movement);
});

socket.on('player died', function() { 
  console.log('player died');
  $('#' + socket.id).addClass('player__died');
  document.removeEventListener('keydown', movement);
});

socket.on('game over', function(users) {
  console.log('game over');
  View.showModalMessage('GAME OVER!\n Ожидайте автоматического рестарта');
});

socket.on('userslist change', function(users) {
  View.renderPList(users);
  View.renderWList(users);
});

socket.on('shot', function(coordX) {
  View.shot(coordX);
});

socket.on('chat new message', function(data) {
  View.printNewMessage(data);
});

//Вспомогательные функции
function restart() {
  View.hideModalMessage();
//  socket.emit('game restart');
}

let movement = function movement(event) {
  switch (event.keyCode) {
    case 65:
    case 68: {
      socket.emit('player move', event.keyCode);
      break;
    };
    default: {
      console.log(event.keyCode);
    }
  }
};

function send() {
  let dataMessage = $('#message')[0].value;
  socket.emit('user new message', dataMessage);
  $('#message')[0].value = "";
}

//Не используются
socket.on('message', function(data) {
    console.log(data);
});