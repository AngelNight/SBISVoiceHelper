chrome.runtime.onMessage.addListener(function(request) {
	if(request.callback){
		chrome.tts.speak(request.utterance,request.options,request.callback);
	}else{
		chrome.tts.speak(request.utterance,request.options);
	}
});