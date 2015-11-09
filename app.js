//todo: убрать, было сделано для теста
var bird = document.getElementById('logoPtica');
if(bird){
   bird.className += 'bird icon-32 icon-Microphone icon-primary';
   bird.title = 'SBIS Voice Helper';
   bird.click = function(){
      alert('SBIS Voice Helper');
   };
}