/**
 * Created by espri on 11.05.2017.
 */

var parsing = require('./modules/parsing.js');
var dataset = require('./modules/dataset.js');
var mongoose = require('mongoose');


var languages = [
    'russian',
    'bulgarian',
    'czech',
    'danish',
    'dutch',
    'english',
    'finnish',
    'french',
    'greek',
    'german',
    'hungarian',
    'italian',
    'japanese',
    'koreana',
    'norwegian',
    'polish',
    'portuguese',
    'brazilian',
    'romanian',
    'schinese',
    'spanish',
    'swedish',
    'tchinese',
    'thai',
    'turkish',
    'ukrainian'
];


// todo
// доставать цену в долларах
// проденты получать числом

dataset.then(function(){

    var Game = mongoose.model('game');

    parsing.parseAll({}).then(function(result){

        //result.items.splice(3, 2);

        Game.fill2(result.items).then(function(newGames){

            //console.log("newGames", newGames);

        });
        //console.log("RES", result);

    });

});