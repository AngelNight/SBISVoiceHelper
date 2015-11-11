var SpeechHandler = function() {
   return {
      _handlers : {
         'отправить сообщение': function () {
            this._log(arguments);
         },
         'перейти в': function () {
            this._log(arguments);
         },
         'найти сотрудника': function () {
            this._log(arguments);
         },
         'прочитать новость': function () {
            this._log(arguments);
         },
         'создать задачу': function () {
            this._log(arguments);
         }
      },
      _trim: function(str){
         return str.replace(/^\s*|\s*$/g, '');
      },
      _log: function(text){
         console.log(text);
      },

      parse: function(text){
         text = this._trim(text.toLowerCase());
         for( var handlerName in this._handlers ){
            if( text.indexOf(handlerName) + 1 ){
               this._log(handlerName);
               this._handlers[handlerName].call(this, this._trim(text.replace(handlerName, '')));
               break;
            }
         }
      }
   };
};