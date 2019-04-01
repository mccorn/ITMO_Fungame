let model ={
  
};

model.init = function init() {
  model.players = [];
  model.viewers = [];
  model.status = 100;
  
  model.NICKNAMES = ["Kunny", "Bob Marlya", "Meow", "Trololo", "Pryam Nick", "NAME_NOT_FOUND", "228", "Sub_0", "Astma Martin", "U.S.S.R", "3ko", "proFUN", "Litrballist"];
  model.STYLES = ['green', 'red', 'blue', 'orange', 'black'];
  model.MAXPLAYERSCOUNT = 1;
    
  model.hunter = {
    x: 50,
    y: 0,
//    width: 15,
    targets: 0,
  };

  model.generateNickname = function generateNickname() {
    return (model.NICKNAMES.length) ? model.NICKNAMES.sort(()=>Math.random() - 0.5).pop() : "Anonym";
  };
  
  model.addPlayer = function addPlayer(someplayer) {
    this.players.push(someplayer);
  };

  model.addViewer = function addViewer(someviewer) {
    this.viewers.push(someviewer);
  };

  model.deletePlayer = function deletePlayer(someID) {
    this.players = this.players.filter(function(el) {
      return el.id !== someID;
    });
  };

  model.deleteViewer = function deleteViewer(someID) {
    this.viewers = this.viewers.filter(function(el) {
      return el.id !== someID;
    });
  };

  model.getUser = function(someID) {
    for (let key1 in this.players) {
      if (this.players[key1].id && this.players[key1].id == someID) return this.players[key1];
    }  
    for (let key1 in this.viewers) {
      if (this.viewers[key1].id && this.viewers[key1].id == someID) return this.viewers[key1];
    }
    return false;
  };
  
  model.deleteUser = function deleteUser(someID) {
    let p = [];
    for (let key in model.players) {
      if (model.players[key].id && model.players[key].id !== someID) p.push(model.players[key]);
    }
    model.players = p.slice();
    p = []
    for (let key in model.viewers) {
      if (model.viewers[key].id && model.viewers[key].id !== someID) p.push(model.viewers[key]);
    }
    model.viewers = p.slice();
  };

  model.hunter.move = function move() {
    const step = 1;
    let rule = Math.round(Math.random());
    if (rule) {
      this.x = (this.x < 100 - step) ? this.x + step : 100 - step;
    } else {
      this.x = (this.x >= step) ? this.x - step : step;
    };
  };

  model.hunter.atack = function atack(someusers) {
    let result = [];
    let h = model.hunter;
    console.log('atack - ' + h.x);
    for (var id in someusers){
      el = someusers[id];
      let hunterleft = h.x - h.width/2;
      let hunterright = h.x + h.width/2;
      let userleft = el.x - el.width/2;
      let userright = el.x + el.width/2;
      if (!el.isDied && (h.x > userleft) && (h.x < userright)) {
  //      Успешное попадание по пользователю
        result.push(el.id);
        model.hunter.targets++;
      } else {
        console.log('miss atack - '  + el.x);
      };
    };
    return result;
  };
  
  model.killPlayer = function killPlayer(someID) {
    console.dir(someID + ' - died');
    let killPlayer = this.getUser(someID).isDied = true;
  };
  
  model.getNickname = function getNickname(someID) {
    return this.getUser(someID).nickname;
  };
};

model.init();

//console.log(model.viewers);
//model.addViewer({'id':'123'});
//model.addViewer({'id':'32123'});
//console.log(model.viewers);
//model.deleteViewer('32123');
//console.log(model.viewers);
module.exports = model;