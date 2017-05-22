/**
 * Created by espri on 12.05.2017.
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var emoji = require('node-emoji');
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

UserSchema.statics.sendToAll = function (text, options) {
    this.find({}).then(function(users){
        _.each(users, function(user){
            user.sendMessage(text, options);
        });
    });
};

UserSchema.methods.sendMessage = function (text, options) {
    var user = this;
    var bot = botApp.botInstance;
    return bot.sendMessage(user.id, emoji.emojify(text), options);
};

var Model = mongoose.model('user', UserSchema);

module.exports = Model;