var bird = document.getElementById('logoPtica');
if(bird){
   bird.className += 'bird icon-32 icon-Microphone icon-primary';
   bird.title = 'SBIS Voice Helper';
   bird.addEventListener("click", function(){
      alert('SBIS Voice Helper');
   });
}