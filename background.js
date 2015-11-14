chrome.runtime.onMessage.addListener(function(request) {
	if(request[2]){
		chrome.tts.speak(request[0],request[1],request[2]);
	}else{
		chrome.tts.speak(request[0],request[1]);
	}
});