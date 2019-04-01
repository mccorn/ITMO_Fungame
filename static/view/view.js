let View = {};

const styles = ['green', 'red', 'blue', 'orange', 'black'];
const songs = ['#screen_waiting__audio', '#screen_play__audio'];

View.render = function render(someusers) {
  console.log('View.render');
  View.printPlaydesk(someusers);
}

View.renderWList = function renderWList(somemodel) { 
  console.log('View.renderWList');
  let tmp = document.getElementById("template__waitlist").innerHTML;
  let output = Mustache.render(tmp, somemodel);
  $("#wait_list__half_top").html(output);
};

View.renderPList = function renderPList(somemodel) {
  console.log('renderPList');
  let tmp = document.getElementById("template__playlist").innerHTML;
  let output = Mustache.render(tmp, somemodel);
  $("#playdesk__list").html(output);
}

View.printPlaydesk = function printPlaydesk(somemodel){
  console.log('View.printPlaydesk');
  let tmp = document.getElementById("template__playdesk").innerHTML;
  let output = Mustache.render(tmp, somemodel);
  $("#playdesk").html(output);
  
}

View.showScreen = function showScreen(someSelector, flag) {
  if (flag) $('.screen').hide();
  $(someSelector).show();
  console.log(someSelector);
  if (someSelector == '.screen_play') {
    $(".rules_list__content").removeClass("moved");
    $('.bg').empty();
    $(songs[0])[0].pause();
    $(songs[0])[0].currentTime = 0;
    $(songs[1]).attr('loop', 'true');
    $(songs[1])[0].play(); 
  } else if (someSelector == '.screen_waiting') {
    $(songs[1])[0].pause();
    $(songs[1])[0].currentTime = 0;
    $(songs[0])[0].play(); 
  }
};

View.hideScreen = function hideScreen(someSelector) {
  $(someSelector).hide();
};

View.showModalMessage = function showModalMessage(message) {
  $('.screen_modal').css({'z-index': 400});
  $('.screen_modal').show();
  let modal = document.getElementById('modal_message');
  let modal_text = document.getElementById('modal_message__text');
  modal_text.textContent = message;
  $(modal).show();
};

View.hideModalMessage = function hideModalMessage() {
  View.hideScreen('.screen_modal');
};

View.printCountdown = function printCountdown(timerSize) {
  if (!timerSize) return;
  let $countdowndiv = $('.countdown');
  let i = timerSize;
  $countdowndiv.empty();  
  $countdowndiv.append(Math.floor(i / 1000));
  let timer = setInterval(function() {                
    if (i <= 1000) clearInterval(timer); else {  
      i -= 1000;
      $countdowndiv.empty();  
      $countdowndiv.append(Math.floor(i / 1000)); 
    }
  }, 1000);
  $('.screen_countdown').css({'z-index': 400});
  $('.screen_countdown').show();
};

View.deleteCountdown = function deleteCountdown() {
  $('.screen_countdown').css({'z-index': 0});
  $('.screen_countdown').hide();
};

View.shot = function shot(posX) {
  console.log('shot - ' + posX);
  let div = document.createElement('div');
  $(div).addClass('shot').css({
    "position": "absolute",
    "height": "10px",
    "width": "10px",
    "left": posX + "%",
    "top": "77%",
    "border-radius": "50%",
    "background": "#000 url(../img/hole.png) center center no-repeat",
    "background-size": "10px 10px",
    "border": "2px solid #999",
  });
  $('.bg').append(div);
  let $sound_shoot = $('#sound_shoot')[0];
  $sound_shoot.currentTime = 1200;
  $sound_shoot.play();
  console.dir($sound_shoot);
  setTimeout(function(){
    $sound_shoot.pause(); 
    $sound_shoot.currentTime = 0;
  }, 1000)
};

View.printNewMessage = function (data) {
  let tmp = document.getElementById('template__message').innerHTML;
  let output = Mustache.render(tmp, data);
  $('#textarea').append($(output));
}