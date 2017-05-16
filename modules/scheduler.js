
var argv = require('minimist')(process.argv.slice(2));
var CronJob = require('cron').CronJob;
var parsing = require('./parsing.js');
var dataset = require('./dataset.js');
var mongoose = require('mongoose');
var ee = require('event-emitter');
var emitter = ee();

var start = function(callback){

    if(!argv.stop_first_grab) {
        callback();
    }

    return new CronJob({
        cronTime: '0 5 * * * *',    // каждый час на пятой минуте
        onTick: callback,
        start: true,
        timeZone: 'Europe/Moscow'
    });

};

// ожмдание готовности БД
dataset.then(function(){

    var Game = mongoose.model('game');

    start(function(){

        parsing.parseAll({}).then(function(result){

            //result.items.splice(3, 2);
            Game.fill(result.items).then(function(newGames){
                emitter.emit('new', newGames);
            });

        });

    });

    emitter.emit('db');

});

module.exports = emitter;