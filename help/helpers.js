//Прочитать новость с id
var bl = new $ws.proto.BLObject('Новость');
bl.call("ПрочитатьНовость", {
    'ИдО': 1528823,
    'ИмяМетода': "Новость.СписокДекларативный"
}, 'record').addCallback(function (record) {
    console.log(record.get('Лид'))
});

//Создание задачи в разработку (нужно находиться в разделе Задачи)
var butt = $ws.single.ControlStorage.getByName('AddTask');
var filter = butt.getBrowser() ? butt.getBrowser().getQuery() : {};
filter['ТипДокумента'] = 15;
filter['ТипДокумента.ИмяОбъекта'] = "СлужЗап";
filter['ТипДокумента.ИмяДиалога'] = "js!SBIS3.EDO.Task";
var res = butt._notify("onClick", filter);
