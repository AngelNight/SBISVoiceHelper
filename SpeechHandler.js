var DEBUG = 0,
    allow = true;
// ключевые фразы помеченные знаком /*!DANGER!*/
// не распознаются или распознаются с ошибками

var pageUrls = {
    'документы': 'edo.html',
    'задачи': 'mydoc.html',
    'задаче': 'mydoc.html',
    'бизнес': 'contragents.html',
    'учет': 'accounting.html',
    'сотрудники': 'staff.html',
    'контакты': 'contacts.html',
    'контакте': 'contacts.html',
    'календарь':'calendar.html',
    'уц':'ca.html', /*!DANGER!*/
    'телефонию':'tel.html', /*!DANGER!*/
    'телефоне': 'tel.html',
    'телефонии':'tel.html',
    'профиль':'myProfile.html',
    'престо':'presto.html', /*!DANGER!*/
    'сообщения':'contacts.html',
    'сообщении':'contacts.html',
    'сообщение':'contacts.html'
};

var SpeechHandler = function() {
   return {
      _handlers : {
          'ты здесь': function(text) {
              Say('Для вас всегда');
          },
         'компания': function (text){
            companysearch(text);
         },
         'включи свою любимую песню': function(text){
               window.open('https://www.youtube.com/embed/eW4rDyJJL04?autoplay=1');
         },
         'добавить задачу': function (text){
             /*  chrome.storage.local.get('isTired', function(result) {
                 console.log(result.isTired);
             if (!result.isTired){
                     addTask(text);
             } else {
             chrome.storage.local.set({'isTired': 0});
                Say("Я слишком устала. Может быть позже");
            }});*/
             if (localStorage['isTired'] == 0){
                 addTask(text);
             } else {
                 localStorage['isTired'] = 0;
                 Say("Я слишком устала. Может быть позже");
             }

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
                 text = p.replace(gName,'').trim();

             findUserByName(gName ,function(response) {

                 if(response)
                 {
                     var id = response[9],
                         name = response[1];

                     jQuery.ajax({
                         url: getDomain()+'service/',
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
          'перейти на главную': function (text) {

              Say('Перехожу на главную');
              document.location.href = getDomain();
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
         'прочитай новости': function () {
            this._log(arguments);

            var news_div2 = document.getElementsByClassName('news_as_link ellipsisStartPage')[0];
            var id_n = news_div2.getAttribute('news_id');


            console.log('Ищу');
             jQuery.ajax({
                 url:getDomain()+'service/',
                 data: JSON.stringify({
                     id:1,
                     jsonrpc: "2.0",
                     protocol: 3,
                     method: "Новость.ПрочитатьНовость",
                     params:{
                        ИдО: id_n,
                        ИмяМетода: "Новость.СписокДекларативный"
                         }
                     
                 }),success: function(response){
                     

                     console.log('response:',response); //раскоментируй, чтобы видеть ответ
                     
                      //var news_div = document.getElementsByClassName('news_as_link ellipsisStartPage')[0];
                      //news_div.getAttribute('news_id')

                     if(response.result.d.length > 0){

                          var row =response.result.d[36].substr(0, 150);

                          console.log(row);
                          Say(row);

                      } else {
                          console.log('Новость не найдена');
                      }


                 },dataType:"json",type:"post",contentType: 'application/json; charset=utf-8'});
         },

          'мне нравится': function(){
             this._log(arguments);

          var news = $('.news-PreprocessorNews-main_page tr').eq(0);
          var el = news.find('.news_icons').eq(1);
          var count = parseInt(el.find('.news_icons_text').text()) || 0;
          el.find('.icon-16').click();
          setTimeout(function(){el.find('.news_icons_text').text( count + 1 );},1500);

         },

         'плохая новость': function(){
             this._log(arguments);

          var news = $('.news-PreprocessorNews-main_page tr').eq(0);
          var el = news.find('.news_icons').eq(0);
          var count = parseInt(el.find('.news_icons_text').text()) || 0;
          el.find('.icon-16').click();
          setTimeout(function(){el.find('.news_icons_text').text( count + 1 );},1500);

         },

         'открой комментарии':function(){

                  var div_comm = jQuery('.news_as_link.ellipsisStartPage');
                  jQuery(div_comm[0]).find(".root_title").click();

         },

         'закрой комментарии':function(){
                jQuery(".sbisname-window-title-close").click();

         },


         'отправить комментарий':function(p){
          if(!p) return;

          var news_div3 = document.getElementsByClassName('news_as_link ellipsisStartPage')[0];
          var id_n1 = news_div3.getAttribute('news_id');
           var text1 = p.replace(name,'').trim();

           jQuery.ajax({
                         url: getDomain()+'service/',
                         data: JSON.stringify({
                             id: 1,
                             jsonrpc: "2.0",
                             protocol: 3,
                             method: "НовостьКомментарий.СоздатьКомментарий",
                             params: {
                                GUID: "cb37dc0d-21a6-4bba-9a53-bca1ede8e513",
                                ИдНовости: id_n1,
                                Текст: text1
                             }
                         }), success: function (response) {
                             Say(text1);
                         }, dataType: "json", type: "post", contentType: 'application/json; charset=utf-8'
                     });

         },
          'позвони': function(text){
              findUserByName(text.trim(),function(response){

                  if(response){

                      //console.log(response);

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
               this._handlers[handlerName].call(this, text.replace(handlerName, '').trim());
               break;
            }
         }

         //allow = false;
      }
   };
};

function companysearch(text) {
   var text = text.trim();
   var xhr = new XMLHttpRequest();
   var json_text = JSON.stringify(
       {"jsonrpc":"2.0","protocol":3,"method":"Контрагент.СписокОбщийИСПП",
           "params":{"ДопПоля":[],"Фильтр":{"d":[true,text,"1","1"],
           "s":[{"n":"ИскатьВФилиалах","t":"Логическое"},{"n":"Реквизиты","t":"Строка"},
           {"n":"Состояние","t":"Строка"},{"n":"СтатусКонтрагента","t":"Строка"}]},
           "Сортировка":{"s":[{"n":"n","t":"Строка"},{"n":"o","t":"Логическое"},
           {"n":"l","t":"Логическое"}],"d":[["Выручка",true,false]]},
           "Навигация":{"s":[{"n":"Страница","t":"Число целое"},
           {"n":"РазмерСтраницы","t":"Число целое"},{"n":"ЕстьЕще","t":"Логическое"}],
           "d":[0,20,true]}},"id":1}
        );

   xhr.open('POST', getDomain()+'/service/sbis-rpc-service300.dll', true);
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
         var result_str = "По вашему запросу найдена организация " + result.name + " в городе " + result.city
             + " основанная " + result.dob() + " с директором " + result.director + " и специализацией " + result.special;
         Say(result_str);
      }

   }
}

function addTask(text) {
    var getnumber = new XMLHttpRequest();
    var settext = new XMLHttpRequest();
    var setempl = new XMLHttpRequest();

    getnumber.open('POST', getDomain()+'/service/sbis-rpc-service300.dll', true);
    settext.open('POST', getDomain()+'/service/sbis-rpc-service300.dll', true);
    setempl.open('POST', getDomain()+'/service/sbis-rpc-service300.dll', true);

    getnumber.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    settext.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    setempl.setRequestHeader('Content-type', 'application/json; charset=utf-8');


    text = text.trim();
    var name = text.split(' ')[0]+" "+ text.split(' ')[1];
    text = text.split(' ').slice(2).join(' ');
    // Номер рабоника для назначения задачи
    var empl;
    var number; //Номер документа
    var json_number = JSON.stringify({"jsonrpc":"2.0","protocol":3,"method":"СлужЗап.Создать",
            "params":{"Фильтр":{"d":["612693,ПапкаДокументов",false,"-1","-1","Все","true",
            "С узлами и листьями","ПапкаДокументов","Без разворота",true,"Название",false,"ПорНомер","true","1321","15","js!SBIS3.EDO.Task","СлужЗап",true],
            "s":[{"n":"ПапкаДокументов","t":"Строка"},{"n":"ФильтрУдаленные","t":"Логическое"},{"n":"ФильтрАвторИлиОтвОтдел","t":"Строка"},{"n":"ФильтрАвторИлиОтветственный","t":"Строка"},{"n":"ФильтрВладелец","t":"Строка"},{"n":"ФильтрРассчитатьВД","t":"Строка"},{"n":"ВидДерева","t":"Строка"},{"n":"HierarchyField","t":"Строка"},{"n":"Разворот","t":"Строка"},{"n":"ПутьКУзлу","t":"Логическое"},{"n":"ЗаголовокИерархии","t":"Строка"},{"n":"ЕстьДочерние","t":"Логическое"},{"n":"_ПорНомер__","t":"Строка"},{"n":"ПоказИерархии","t":"Строка"},{"n":"Регламент","t":"Строка"},{"n":"ТипДокумента","t":"Строка"},{"n":"ТипДокумента.ИмяДиалога","t":"Строка"},
                {"n":"ТипДокумента.ИмяОбъекта","t":"Строка"},
                {"n":"ВызовИзБраузера","t":"Логическое"}]},
                "ИмяМетода":"СлужЗап.Список"},"id":1});
    findUserByName(name,function(response) {
        if (response) {
            console.log(response[9]);
            empl = response[9];
            getnumber.send(json_number);
        } else {
            console.log('Сотрудник не найден.');
        }
    });


    getnumber.onreadystatechange = function () {
        if (getnumber.readyState != 4) return;

        if (getnumber.status != 200) {
            // обработать ошибку
            Say(getnumber.status + ': ' + getnumber.statusText);
        } else {
            try {
                console.log("Запрос на получение номера вернул: "+getnumber.responseText);
                var information = JSON.parse(getnumber.responseText);
                number = information.result.d[0];
                var json_empl = JSON.stringify({"jsonrpc":"2.0","protocol":3,"method":"ФункциональнаяОбласть.ЗаписатьЗонуОтветственностиИИсполнителей","params":{"Документ":number,"ЗонаОтветственности":null,"Исполнители":[empl.toString()]},"id":1});
                setempl.send(json_empl);
            } catch (e) {
                Say("Некорректный ответ " + e.message);
            }
        }};

    setempl.onreadystatechange = function () {

        if (setempl.readyState != 4) return;

        if (setempl.status != 200) {
            // обработать ошибку
            Say(setempl.status + ': ' + setempl.statusText);
        } else {
            try {
                console.log("Назначен работник");
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
                            {"n":"РП.ИдСпискаРассылки","t":"Текст"},
                            {"s":"Иерархия","t":"Идентификатор","n":"ПапкаДокументов"},
                            {"s":"Иерархия","t":"Логическое","n":"ПапкаДокументов@"},
                            {"s":"Иерархия","t":"Логическое","n":"ПапкаДокументов$"}],
                            "d":[number,[null],null,null,text,[62],true,null,[-4],null,null,[null],false,null,[null],null,null,[null],null,null,empl,[9556,"ПапкаДокументов"],false,false],"_type":"record","_key":number}},"id":1});
                settext.send(json_text);
                console.log("Отправлен текст:"+text+"в задачу #"+number);

            } catch (e) {
                Say("Некорректный ответ " + e.message);
            }
        }

    };

    settext.onreadystatechange = function () {

        if (settext.readyState != 4) return;

        if (settext.status != 200) {
            // обработать ошибку
            Say(settext.status + ': ' + settext.statusText);
        } else {
            try {
                //Say("Задача с текстом "+text+" успешно добавлена");
                document.location.href = getDomain()+'mydoc.html';
            } catch (e) {
                Say("Некорректный ответ " + e.message);
            }

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
    var url = '/webrtc/static/window.html#room=' + createGUID() + '&toInvite={"faceId":'+userId+',"clientId":3}&video=true';
    window.open(url, '', 'width=1110,height=832,top=52,left=405,target=window');
}
