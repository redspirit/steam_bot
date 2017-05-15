/**
 * Created by espri on 12.05.2017.
 */

var argv = require('minimist')(process.argv.slice(2));
var mongoose = require('mongoose');
var def = require('deferred')();
var configAll = require('./../config.json');
var config = argv.local ? configAll.mongo_local : configAll.mongo_release;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.host + ':' + config.port + '/' + config.database + '?auto_reconnect', {
    user: config.user,
    pass: argv.db_password,
    autoIndex: config.autoIndex
});

var db = mongoose.connection;

db.on('error', function(e){
    console.error('Ошибка подключения к базе:', e);
    def.reject(e);
});

db.once('open', function callback () {
    console.log('Связь с базой установлена');

    mongoose.model('game', require('./../models/game_model.js'));
    mongoose.model('user', require('./../models/user_model.js'));
    console.info('Модели добавлены');

    def.resolve();
});

module.exports = def.promise;