/**
 * Created by espri on 27.09.2016.
 */

var argv = require('minimist')(process.argv.slice(2));
var TelegramBot = require('node-telegram-bot-api');
var ee = require('event-emitter');
var hasListeners = require('event-emitter/has-listeners');
var _ = require('underscore');
var config = require('./../config.json').bot;
var emoji = require('node-emoji');
var emitter = ee();
var mongoose = require('mongoose');

var options = {
    polling: true
};

module.exports.start = function(){

    if(argv.local) {
        console.log('Запущено в локальном режиме, бот не будет работать');
        return {};
    }

    var User = mongoose.model('user');
    var Game = mongoose.model('game');

    console.log("config.token, options", config.token, options);

    var bot = new TelegramBot(config.token, options);
    bot.getMe().then(function (me) {
        console.log('Hi my name is %s!', me.username);
    });
    module.exports.bot = bot;
    module.exports.User = User;
    module.exports.Game = Game;

    bot.on('message', function (msg) {
        //var chatId = msg.chat.id;
        //// photo can be: a file path, a stream or a Telegram file_id
        //var photo = __dirname + '/files/cat.jpg';
        //bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});

        //{   message_id: 248,
        //    from: { id: 107577068, first_name: 'Алексей', username: 'espritto' },
        //    chat:
        //    { id: 107577068,
        //        first_name: 'Алексей',
        //        username: 'espritto',
        //        type: 'private' },
        //    date: 1474986291,
        //    text: '/go hello',
        //    entities: [ { type: 'bot_command', offset: 0, length: 3 } ] }

        var cmdParams = [];
        var cmd = msg.text ? msg.text.match(new RegExp("^\\/(\\w+)", 'i')) : '';
        if(cmd) {
            cmd = cmd[0];
            cmdParams = msg.text.split(' ');
            cmdParams[0] = msg.text.substr(cmd.length).trim();
        }

        msg.send = function(text, options){
            var opt = {};
            if(options) {
                opt = _.clone(options);
                if(opt.reply_markup)
                    opt.reply_markup = JSON.stringify(options.reply_markup);
            }
            opt.disable_web_page_preview = true;
            return bot.sendMessage(msg.chat.id, emoji.emojify(text), opt);
        };

        User.byId(msg.from.id).then(function(user){

            if(!user && cmd != '/start')
                return bot.sendMessage(msg.chat.id, 'Выполните /start для начала работы с ботом');

            if(cmd)
                emitter.emit(cmd, msg, user, cmdParams);
            else {
                if(hasListeners(emitter, msg.text))
                    emitter.emit(msg.text, msg, user);
                else
                    emitter.emit('*', msg, user);
            }

        });

    });
    module.exports.botInstance = bot;
    return bot;
};

module.exports.event = emitter;
