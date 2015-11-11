var bird = document.getElementById('logoPtica');
if(bird){
   bird.className += 'bird icon-32 icon-Microphone icon-primary';
   bird.title = 'SBIS Voice Helper';

   // Google Web Speech API
   var rec = new webkitSpeechRecognition(),
         sHadler = new SpeechHandler();
   rec.continuous = true;
   rec.interimResults = true;
   rec.lang = 'ru';
   rec.onstart = function () {
      rec.isRunning = true;
   };
   rec.onend = function () {
      rec.isRunning = false;
   };
   rec.onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
         if (event.results[i].isFinal) {
            sHadler.parse(event.results[i][0].transcript);
         }
      }
   };

   // так работает в ie8
   bird.onclick = function(){
      if( rec.isRunning ) {
         rec.stop();
      }
      else {
         rec.start();
      }
   };
}