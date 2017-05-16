/**
 * Created by espri on 12.05.2017.
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var botApp = require('./../modules/bot.js');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    id: Number,
    username: String,
    first_name: String,
    registered: Date
}, {
    versionKey: false
});


UserSchema.statics.saveUser = function (from) {
    var User = this;
    var user = new User(from);
    user.registered = new Date();
    return user.save();
};

UserSchema.statics.removeUser = function (from) {
    return this.remove({id: from.id}).then(function(a){
        return a.result;
    });
};

UserSchema.statics.byId = function (id) {
    return this.findOne({id: id});
};

UserSchema.statics.sendToAll = function (msg) {

    console.log("call");

    var bot = botApp.botInstance;

    //console.log("bot", botApp);

    console.log("bot.sendMessage", bot.sendMessage);

    bot.sendMessage(107577068, msg);

    //return this.findOne({id: id});
};




module.exports = UserSchema;