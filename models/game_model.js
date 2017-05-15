/**
 * Created by espri on 12.05.2017.
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');
var deferred = require('deferred');
var uploader = require('./../modules/uploader.js');

var Schema = mongoose.Schema;
var GameSchema = new Schema({
    game_id: String,             // может быть бандл с многими id
    title: String,
    discount: Number,
    price: Number,
    priceOld: Number,
    image: String,
    is_bundle: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false
});

GameSchema.statics.fill = function (list) {

    console.log("Total", list.length);

    var Game = this;
    var def = deferred();

    var added = [];

    var tasks = _.map(list, function(item){
        return function(cb){
            Game.findOne({game_id: item.id}).then(function(game){
                if(game) {
                    if(!game.is_active) {
                        game.is_active = true;
                        added.push(game);
                        console.log("Returned", game.title);
                        game.save(cb);
                    } else {
                        //console.log("WHAT?", game.title);
                        cb(null);
                    }
                } else {

                    game = new Game();
                    game.game_id = item.id;
                    game.title = item.title;
                    game.discount = item.discount;
                    game.price = parseInt(item.price);
                    game.priceOld = parseInt(item.priceOld);
                    game.image = item.img;
                    game.is_active = true;
                    game.is_bundle = item.id.indexOf(',') > 0;
                    added.push(game);
                    console.log("Added", game.title, '<'+game.game_id+'>');
                    game.save(cb);
                    game.uploadPoster();

                }
            });
        }
    });

    async.parallelLimit(tasks, 3, function(err, res){
        if(err)
            return def.reject(err);

        Game.setDeletedGames(list).then(function(deleted){

            console.log("Append", added.length);

            def.resolve({
                deleted: deleted,
                added: added
            });

        });

    });

    return def.promise;

};

GameSchema.statics.setDeletedGames = function (list) {

    var Game = this;
    var def = deferred();

    Game.find({is_active: true}).then(function(games){

        var listIds = _.pluck(list, 'id');
        var gamesIds = _.pluck(games, 'game_id');
        var diffs = _.difference(gamesIds, listIds);

        console.log("diffs", diffs);

        Game.find({game_id: {$in: diffs}}).then(function(finded){

            _.each(finded, function(game){
                console.log("Deleted", game.title);
                game.is_active = false;
                game.save();
            });

            def.resolve(finded);

        });

    });

    return def.promise;

};


GameSchema.methods.uploadPoster = function () {
    return uploader.load(this.image, this.game_id);
};

module.exports = GameSchema;