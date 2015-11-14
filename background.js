chrome.runtime.onMessage.addListener(function(request,sender,callback) {

    //callback();
    chrome.tts.speak(request[0],request[1],callback);

//    chrome.tts.speak("Hello, world!", {
//        requiredEventTypes: ['end'],
//        onEvent: function(event) {
//            if(event.type === 'end') {
//                alert('Speech ended.');
//            }
//        }
//    },function(){
//        alert('конец');
//    });

});

