var bird = document.getElementById('logoPtica');
if(bird){
   bird.className += 'bird icon-32 icon-Microphone icon-primary';
   bird.title = 'SBIS Voice Helper';
   // так работает в ie8
   bird.onclick = function(){
      alert('SBIS Voice Helper');
   };
}