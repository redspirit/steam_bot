/**
 * Created by espri on 11.05.2017.
 */

var app = require('./modules/bot.js');
var scheduler = require('./modules/scheduler.js');

app.event.on('/start', function(msg, user, params){

    msg.send('STEAM DISCOUNTS\n' +
        'Hello, ' + msg.from.first_name + '!\n' +
        'The bot is under construction. Once the bot is ready, it will notify you');

    app.User.saveUser(msg.from, function(data){
        if(err)
            return false;
        console.log("Новый пользователь:", data.first_name);
    })

});

scheduler.on('new', function(games){

    console.log("EVENT", games);

});

scheduler.on('db', function(){

    app.start();

});