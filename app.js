/**
 * Created by espri on 11.05.2017.
 */

var _ = require('underscore');
var app = require('./modules/bot.js');
var scheduler = require('./modules/scheduler.js');

app.event.on('/start', function(msg, user, params){

    msg.send('Hello, ' + msg.from.first_name + '!\n' +
        'The bot is under construction. Once the bot is ready, it will notify you.\n' +
        'Use /help to get available commands');

    if(!user)
        app.User.saveUser(msg.from, function(data){
            console.log("Новый пользователь:", data.first_name);
        });

});

app.event.on('/help', function(msg, user, params){

    msg.send('Доступные команды:\n' +
        '/most_profitable - 10 самых выгодных предложений \n' +
        '/most_expensive - 10 самых дорогих игры с учетом скидки \n' +
        '/cheapest - 10 самых дешевых игры с учетом скидки \n' +
        '/language - установить язык бота \n' +
        '/stop - отписаться от уведомлений \n' +
        '/donate - поддержи разработчика'
    );

});

app.event.on('/stop', function(msg, user, params){

    msg.send('Вы отписались от уведомлений');

    if(user)
        app.User.removeUser(msg.from, function(){
            console.log("Пользователь удален:", msg.from.first_name);
        });

});

app.event.on('/most_profitable', function(msg, user, params){

    app.Game.mostProfitable(10).then(function(list){
        var string = _.map(list, function(game, n){
            return (n+1) + '. ' + game.title + ' - ' + game.discount + '% за ' + game.price;
        });
        msg.send('10 самых выгодных предложений: \n' + string.join('\n'));
    });
    
});

app.event.on('/most_expensive', function(msg, user, params){

    app.Game.mostExpensive(10).then(function(list){
        var string = _.map(list, function(game, n){
            return (n+1) + '. ' + game.title + ' - ' + game.discount + '% за ' + game.price;
        });
        msg.send('10 самых дорогих игры с учетом скидки: \n' + string.join('\n'));
    });

});

app.event.on('/cheapest', function(msg, user, params){

    app.Game.cheapest(10).then(function(list){
        var string = _.map(list, function(game, n){
            return (n+1) + '. ' + game.title + ' - ' + game.discount + '% за ' + game.price;
        });
        msg.send('10 самых дешевых игры с учетом скидки: \n' + string.join('\n'));
    });

});


scheduler.on('new', function(games){

    console.log("EVENT", games);

});

scheduler.on('db', function(){

    app.start();

    app.User.sendToAll('HELLO');

});