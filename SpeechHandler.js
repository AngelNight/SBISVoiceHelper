var DEBUG = 1;

var pageUrls = {
   'документы': 'https://fix-online.sbis.ru/edo.html',
   'задачи': 'https://fix-online.sbis.ru/mydoc.html',
   'бизнес': 'https://fix-online.sbis.ru/contragents.html',
    'учет': 'https://fix-online.sbis.ru/accounting.html',
    'сотрудники': 'https://fix-online.sbis.ru/staff.html',
    'контакты': 'https://fix-online.sbis.ru/contacts.html',
    'календарь':'https://fix-online.sbis.ru/calendar.html',
    'уц':'https://fix-online.sbis.ru/ca.html',
    'телефонию':'https://fix-online.sbis.ru/tel.html',
    'профиль':'https://fix-online.sbis.ru/myProfile.html',
    'престо':'https://fix-online.sbis.ru/presto.html',
    'сообщения':'https://fix-online.sbis.ru/contacts.html'
};

var SpeechHandler = function() {
   return {
      _handlers : {
         'компания': function (text){
            companysearch(text);
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

            if(arguments.length == 0) return false;
            var page_name = arguments[0].trim();

            if(pageUrls[page_name]){
                Say('Перехожу в '+page_name);
                document.location.href = pageUrls[page_name];
            } else {
                Say('Раздел не найден.');
            }

         },
         'найти сотрудника': function () {
              this._log(arguments);

             jQuery.ajax({
                 url:'https://fix-online.sbis.ru/service/',
                 data: JSON.stringify({
                     id:1,
                     jsonrpc: "2.0",
                     protocol: 3,
                     method: "Персонал.СписокПерсонала",
                     params:{
                         ДопПоля: [],
                         Сортировка: null,
                         Навигация: null,
                         Фильтр: {
                             d: [arguments[0].trim(), "С разворотом", "Только листья"],
                             s:[{n: "СтрокаПоиска", t: "Строка"}, {n: "Разворот", t: "Строка"}, {n: "ВидДерева", t: "Строка"}]
                         }
                     }
                 }),success: function(response){
                     if(response.result.d.length > 0){

                          var row = response.result.d[0];

                         if(row[6]){
                             console.log('Мобильный телефон '+row[1]+' '+row[6]);

                             Say('Мобильный телефон '+row[1]+' '+row[6]);
                         } else {
                             Say('Контактные данные '+row[1]+' не найдены');
                         }

                      } else {
                          console.log('Сотрудник не найден.');
                      }


                 },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});

          },
          'внутренний номер': function () {
              this._log(arguments);

              jQuery.ajax({
                  url:'https://fix-online.sbis.ru/service/',
                  data: JSON.stringify({
                      id:1,
                      jsonrpc: "2.0",
                      protocol: 3,
                      method: "Персонал.СписокПерсонала",
                      params:{
                          ДопПоля: [],
                          Сортировка: null,
                          Навигация: null,
                          Фильтр: {
                              d: [arguments[0].trim(), "С разворотом", "Только листья"],
                              s:[{n: "СтрокаПоиска", t: "Строка"}, {n: "Разворот", t: "Строка"}, {n: "ВидДерева", t: "Строка"}]
                          }
                      }
                  }),success: function(response){
                      if(response.result.d.length > 0){

                          var row = response.result.d[0];

                          console.log(response);

//                          if(row[6]){
//                              console.log('Мобильный телефон '+row[1]+' '+row[6]);
//
//                              Say('Мобильный телефон '+row[1]+' '+row[6]);
//                          } else {
//                              Say('Контактные данные '+row[1]+' не найдены');
//                          }

                      } else {
                          console.log('Сотрудник не найден.');
                      }


                  },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});

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
         //if(DEBUG) Say(text);
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

function companysearch(text) {
   var xhr = new XMLHttpRequest();
   var json_text = JSON.stringify({"jsonrpc":"2.0","protocol":3,"method":"Контрагент.СписокОбщийИСПП",
      "params":{"ДопПоля":[],"Фильтр":{"d":[true,text,null,"-1"],
         "s":[{"n":"ИскатьВФилиалах","t":"Логическое"},{"n":"Реквизиты","t":"Строка"},
            {"n":"Состояние","t":"Строка"},{"n":"СтатусКонтрагента","t":"Строка"}]},
         "Сортировка":{"s":[{"n":"n","t":"Строка"},{"n":"o","t":"Логическое"},
            {"n":"l","t":"Логическое"}],"d":[["Выручка",true,false]]},
         "Навигация":{"s":[{"n":"Страница","t":"Число целое"},
            {"n":"РазмерСтраницы","t":"Число целое"},{"n":"ЕстьЕще","t":"Логическое"}],
            "d":[0,20,true]}},"id":1});

   xhr.open('POST', 'https://online.sbis.ru/service/sbis-rpc-service300.dll', true);
   xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
   xhr.send(json_text);

   xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
         // обработать ошибку
         alert(xhr.status + ': ' + xhr.statusText);
      } else {
         try {
            var information = JSON.parse(xhr.responseText);
         } catch (e) {
            alert("Некорректный ответ " + e.message);
         }
         information = information.result.d[0];
         var months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
         var result = {
            'name': information[1],
            'city': information[2],
            'profit':information[4],
            'dob': function(){ var date = information[16].split('-'); return date[2] +"го "+months[date[1]-1]+' '+date[0]+" года ";},
            'empl': information[17],
            'inn':information[17],
            'director': information[24] + " " + information[25] + " " + information[26],
            'special': information[27]
         };
         var result_str = "По вашему запросу найдена компания " + result.name + " в городе " + result.city
             + "основаная " + result.dob() + " с директором " + result.director + " и специализацией " + result.special;
         Say(result_str);
      }

   }
}

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