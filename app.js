function $(id){
	return document.getElementById(id);
}

function Say(utterance, options, callback) {
  if(!options) options = {voiceName:"Google русский"};
  console.log('Говорю: ' + utterance);

  if (!callback){
	callback = function(){};
  }

  chrome.runtime.sendMessage([utterance,options], callback);

}

var bird = $('logoPtica');
if(bird){
   bird.className += 'bird icon-32 icon-Microphone icon-primary';
   bird.title = 'SBIS Voice Helper';

   // Google Web Speech API
   var rec = new webkitSpeechRecognition(),
         sHandler = new SpeechHandler();

   rec.continuous = true;
   rec.interimResults = true;
   rec.lang = 'ru';
   rec.onstart = function () {
      //Say("Привет, хозяин");
	  rec.isRunning = true;
   };
   rec.onend = function () {
	  //Say("До скорой встречи, хозяин");
      rec.isRunning = false;
   };
   rec.onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
         if (event.results[i].isFinal) {
            sHandler.parse(event.results[i][0].transcript);
         }
      }
   };
   
   rec.onerror = function(event) {
      if (event.error == 'no-speech') {
         Say("Пожалуйста, не молчите. Проверьте настройки микрофона");
      }
      if (event.error == 'audio-capture') {
         Say("Проблемы с записью голоса");
      }

   };

   // так работает в ie8
   bird.onclick = function(){
      if( rec.isRunning ) rec.stop(); else rec.start();
   };
}