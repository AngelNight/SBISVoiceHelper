var DEBUG = 0,
    allow = true;

var pageUrls = {
   'документы': 'edo.html',
   'задачи': 'mydoc.html',
   'бизнес': 'contragents.html',
    'учет': 'accounting.html',
    'сотрудники': 'staff.html',
    'контакты': 'contacts.html',
    'календарь':'calendar.html',
    'уц':'ca.html',
    'телефонию':'tel.html',
    'профиль':'myProfile.html',
    'престо':'presto.html',
    'сообщения':'contacts.html'
};

var SpeechHandler = function() {
   return {
      _handlers : {
          'привет': function(text) {
              console.log('hi!');
              allow = true;
          },
         'компания': function (text){
            companysearch(text);
         },
         'добавить задачу': function (text){
            addTask(text);
         },
         'как дела': function (){
            Say("У меня ничего нового");
         },
         'сколько времени': function (){
            Say(declOfTime());
         },
         'отправить сообщение': function (p) {
             if(!p) return;

             var tmpArg = p.split(' '),
                 gName = [tmpArg[0], tmpArg[1]].join(' '),
                 text = p.replace(name,'').trim();

             findUserByName(gName ,function(response) {

                 if(response)
                 {
                     var id = response[9],
                         name = response[1];

                     jQuery.ajax({
                         url: 'https://fix-online.sbis.ru/service/',
                         data: JSON.stringify({
                             id: 1,
                             jsonrpc: "2.0",
                             protocol: 3,
                             method: "Сообщение.Отправить",
                             params: {
                                 Диалог: null,
                                 Документ: null,
                                 ПолучателиКлиенты: [3],
                                 ПолучателиЛица: [id],
                                 Сообщение: null,
                                 Текст: text,
                                 Файлы: []
                             }
                         }), success: function (response) {
                             Say('Сообщение отправлено ' + name + '   Само сообщение ' + text);
                         }, dataType: "json", type: "post", contentType: 'application/json; charset=utf-8'
                     });
                 }
                 else
                     Say("Пользователь " + gName + " не найден!");
             });
         },
         'перейти в': function (text) {

            if(!text) return;
            var page_name = text.trim();

            if(pageUrls[page_name]){
                Say('Перехожу в '+page_name);
                document.location.href = getDomain()+pageUrls[page_name];
            } else {
                Say('Раздел не найден.');
            }

         },
         'найти сотрудника': function (text) {

             if(!text) return;

             findUserByName(text.trim(),function(response){

                 if(response){

                     console.log(response);

                     if(response[6]){
                         console.log('Мобильный телефон '+response[1]+' '+response[6]);

                         Say('Мобильный телефон '+response[1]+' '+response[6]);
                     } else {
                         Say('Контактные данные '+response[1]+' не найдены');
                     }

                 } else {
                     Say('Сотрудник не найден.');
                 }
             });

          },
          'внутренний номер': function (text) {

              if(!text) return;

              findUserByName(text.trim(),function(response){

                  //console.log(response);

                  if(response){

                      if(response[5]){
                          Say('Внутренний номер '+response[1]+' '+response[5].toString().split('').join(' '));
                      } else {
                          Say('Внутренний номер сотрудника '+response[1]+' не найден.');
                      }

                  } else {
                      Say('Сотрудник не найден.');
                  }
              });

          },
         'прочитать новость': function () {
            this._log(arguments);
            console.log('Ищу');
             jQuery.ajax({
                 url:'https://fix-online.sbis.ru/service/',
                 data: JSON.stringify({
                     id:1,
                     jsonrpc: "2.0",
                     protocol: 3,
                     method: "Новость.ПрочитатьНовость",
                     params:{
                        ИдО: 1526173,
                        ИмяМетода: "Новость.СписокДекларативный"
                         }
                     
                 }),success: function(response){
                     

                     console.log('response:',response); //раскоментируй, чтобы видеть ответ
                     
                      //var news_div = document.getElementsByClassName('news_as_link ellipsisStartPage')[0];
                      //news_div.getAttribute('news_id')

                     if(response.result.d.length > 0){

                          var row =response.result.d[36];

                          console.log(row);
                          Say(row);

                      } else {
                          console.log('Новость не найдена');
                      }


                 },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});
         },

          'мне нравится': function(){
             this._log(arguments);

           /* var div_news = document.getElementsByClassName('news_as_link ellipsisStartPage');
            jQuery(div_news).find(".news_icons");
            jQuery(div_news).click();*/
            console.log('Ищу');
             jQuery.ajax({
                 url:'https://fix-online.sbis.ru/service/',
                 data: JSON.stringify({
                     id:1,
                     jsonrpc: "2.0",
                     protocol: 3,
                     method: "Новость.ПонравиласьНовостьВОнлайне",
                     params:{
                        ИдО: "1526173"
                         }
                     
                 }),success: function(response){
                     

                     console.log('response:',response); //раскоментируй, чтобы видеть ответ
                     
                    var ans = 'Мне нравится ';
                    Say(ans);


                   var div_news = jQuery('.news_as_link.ellipsisStartPage');
                    jQuery(div_news[0]).find(".icon-ThumbUp2").click();

                    

                 },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});

         },



         'плохо': function(){
             this._log(arguments);

           
          
            console.log('Ищу');
             jQuery.ajax({
                 url:'https://fix-online.sbis.ru/service/',
                 data: JSON.stringify({
                     id:1,
                     jsonrpc: "2.0",
                     protocol: 3,
                     method: "Новость.НеПонравиласьНовостьВОнлайне",
                     params:{
                        ИдО: "1526173"
                         }
                     
                 }),success: function(response){
                     

                     console.log('response:',response); //раскоментируй, чтобы видеть ответ
                     
                    var ans = 'Мне не нравится ';
                    Say(ans);


                    var div_news = jQuery('.news_as_link.ellipsisStartPage');
                    jQuery(div_news[0]).find(".icon-ThumbUp2.icon-error").click();

                    

                 },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});

         },



         'создать задачу': function () {
            this._log(arguments);
         },
         'пока': function () {
            rec.stop();
         },
          'позвонить сотруднику': function(text){
              findUserByName(text.trim(),function(response){

                  if(response){

                      console.log(response);

                      if(response[9]){
                          console.log('Вызов '+response[1]);
                          callUser(response[9]);

                          Say('Звоню '+response[1]);
                      }

                  } else {
                      Say('Сотрудник не найден.');
                  }
              });
          }
      },
      _log: function(text){
         console.log(text);
      },

      parse: function(text){
         text = (text.toLowerCase()).trim();

         console.log(text);
         if(DEBUG) Say(text);

         //if(!allow) return false;

         for( var handlerName in this._handlers ){
            if( text.indexOf(handlerName) + 1 ){
               this._log(handlerName);
               this._handlers[handlerName].call(this, text.replace(handlerName, ''));
               break;
            }
         }

         //allow = false;
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

function addTask(text) {
   var xhr = new XMLHttpRequest();
   var json_text = JSON.stringify(
       {"jsonrpc":"2.0","protocol":3,"method":"СлужЗап.Записать",
          "params":{"Запись":{"s":[{"n":"@Документ","t":"Число целое"},
             {"n":"Раздел","t":"Идентификатор","s":"Иерархия"},
             {"n":"Раздел@","t":"Логическое","s":"Иерархия"},
             {"n":"Раздел$","t":"Логическое","s":"Иерархия"},
             {"n":"РазличныеДокументы.Информация","t":"Текст"},
             {"n":"Подразделение.Раздел","t":"Идентификатор","s":"Иерархия"},
             {"n":"Подразделение.Раздел@","t":"Логическое","s":"Иерархия"},
             {"n":"Подразделение.Раздел$","t":"Логическое","s":"Иерархия"},
             {"n":"ТипДокумента.Раздел","t":"Идентификатор","s":"Иерархия"},
             {"n":"ТипДокумента.Раздел@","t":"Логическое","s":"Иерархия"},
             {"n":"ТипДокумента.Раздел$","t":"Логическое","s":"Иерархия"},
             {"n":"Регламент.Раздел","t":"Идентификатор","s":"Иерархия"},
             {"n":"Регламент.Раздел@","t":"Логическое","s":"Иерархия"},
             {"n":"Регламент.Раздел$","t":"Логическое","s":"Иерархия"},
             {"n":"Контрагент.Раздел","t":"Идентификатор","s":"Иерархия"},
             {"n":"Контрагент.Раздел@","t":"Логическое","s":"Иерархия"},
             {"n":"Контрагент.Раздел$","t":"Логическое","s":"Иерархия"},
             {"n":"ДокументНашаОрганизация.Контрагент.Раздел","t":"Идентификатор","s":"Иерархия"},
             {"n":"ДокументНашаОрганизация.Контрагент.Раздел@","t":"Логическое","s":"Иерархия"},
             {"n":"ДокументНашаОрганизация.Контрагент.Раздел$","t":"Логическое","s":"Иерархия"},
             {"n":"РП.ИдСпискаРассылки","t":"Текст"},{"s":"Иерархия","t":"Идентификатор","n":"ПапкаДокументов"},
             {"s":"Иерархия","t":"Логическое","n":"ПапкаДокументов@"},
             {"s":"Иерархия","t":"Логическое","n":"ПапкаДокументов$"}],
             "d":[1862030,[null],null,null,text,[62],true,null,[-4],null,null,[null],false,null,[null],null,null,[null],null,null,"14451157",[9556,"ПапкаДокументов"],false,false],"_type":"record","_key":1862030}},"id":1});

   xhr.open('POST', getDomain()+'/service/sbis-rpc-service300.dll', true);
   xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
   xhr.send(json_text);

   xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
         // обработать ошибку
         Say(xhr.status + ': ' + xhr.statusText);
      } else {
         try {
            var information = JSON.parse(xhr.responseText);
         } catch (e) {
            Say("Некорректный ответ " + e.message);
         }
         Say("Задача с текстом "+text+" успешно добавлена");
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

function getDomain(){
    var url = jQuery.trim(window.location.href);
    if(url.search(/^https?\:\/\//) != -1)
        url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
    else
        url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");

    return 'https://'+url[1]+'/';
}

function findUserByName(name,callback){

    if(!name) return;

    jQuery.ajax({
        url:getDomain()+'service/',
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
                    d: [name, "С разворотом", "Только листья"],
                    s:[{n: "СтрокаПоиска", t: "Строка"}, {n: "Разворот", t: "Строка"}, {n: "ВидДерева", t: "Строка"}]
                }
            }
        }),success: function(response){

            if(response.result.d.length > 0){
                 callback(response.result.d[0]);
            } else {
                callback(null);
            }

        },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});
}

function createGUID() {
    var a = 0
      , b = 0
      , c = (new Date).getTime().toString(16);
    c = "000000000000".substr(0, 12 - c.length) + c;
    var d = function() {
        return (c.substring(b, b += a++ % 2 ? 2 : 1) + (65536 * (1 + Math.random()) | 0).toString(16)).substring(0, 4)
    }
    ;
    return d() + d() + "-" + d() + "-" + d() + "-" + d() + "-" + d() + d() + d();
}

function callUser(userId){
    var url = '/webrtc/static/window.html#room=' + createGUID() + '&{"faceId":'+userId+',"clientId":3}&video=true';
    window.open(url, '', 'width=1110,height=832,top=52,left=405,target=window');
}