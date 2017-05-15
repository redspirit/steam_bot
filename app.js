/**
 * Created by espri on 11.05.2017.
 */

var app = require('./modules/bot.js');
var scheduler = require('./modules/scheduler.js');


app.event.on('/start', function(msg, user, params){

    //msg.send(':flag-ru: ONLY RUSSIAN LANGUAGE :flag-ru:\n' +
    //    'Привет, ' + msg.from.first_name + '!\n' +
    //    'Теперь ты можешь добавлять уведомления на любое время. Для понимания происходящего воспользуйся справкой /help\n' +
    //    '❗ ВАЖНО: если у тебя не московский часовой пояс, то укажи его через команду /zone',
    //    {reply_markup: mailListOpts});
    //
    //db.user.saveUser(msg.from, function(err, data){
    //    if(err)
    //        return false;
    //    console.log("Подключился пользователь", data.first_name);
    //})



});



scheduler.on('new', function(games){

    console.log("EVENT", games);

});