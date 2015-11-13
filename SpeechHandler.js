var DEBUG = 1;
var SpeechHandler = function() {
   return {
      _handlers : {
         'компания': function (){
            Say("У меня ничего нового");
         },
         'как дела': function (){
            Say("У меня ничего нового");
         },
         'сколько времени': function (){
            Say(declOfTime());
         },
         'отправить сообщение': function () {
            alert("отправить сообщение");
         },
         'перейти в': function () {
            this._log(arguments);
         },
         'найти сотрудника': function () {
              this._log(arguments);

              console.log('Ищу');

              var obj = new $ws.proto.BLObject("Персонал");

              obj.query('СписокПерсонала',{'СтрокаПоиска': 'Демо','Разворот':'С разворотом','ВидДерева':'Только листья'})
                  .addCallback(function(response){
                      console.log(response);

                      if(response._data.length > 0){

                          var row = response._data[0];

                          console.log('Мобильный телефон '+row[1]+' '+row[6]);

                      } else {
                          console.log('Сотрудник не найден.');
                      }
                  });

          },
         'прочитать новость': function () {
            this._log(arguments);
         },
         'создать задачу': function () {
            this._log(arguments);
         },
         'пока': function () {
            rec.stop();
         }
      },
      _log: function(text){
         console.log(text);
      },

      parse: function(text){
         text = (text.toLowerCase()).trim();
         if(DEBUG) Say(text);
         for( var handlerName in this._handlers ){
            if( text.indexOf(handlerName) + 1 ){
               this._log(handlerName);
               this._handlers[handlerName].call(this, text.replace(handlerName, ''));
               break;
            }
         }
      }
   };
};

function declOfTime()
{
   var date = new Date();
   var minutes = date.getMinutes();
   var hours = date.getHours();
   cases = [2, 0, 1, 1, 1, 2];
   variants = [["час","часа","часов"],["минута","минуты","минут"]];
   minutes = minutes+" "+variants[1][ (minutes%100>4 && minutes%100<20)? 2 : cases[(minutes%10<5)?minutes%10:5] ];
   hours = hours+" "+variants[0][ (hours%100>4 && hours%100<20)? 2 : cases[(hours%10<5)?hours%10:5] ];
   return "Сейчас "+hours+" "+minutes;
}