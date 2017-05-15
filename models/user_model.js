/**
 * Created by espri on 12.05.2017.
 */

var mongoose = require('mongoose');
var _ = require('underscore');

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

UserSchema.statics.byId = function (id) {
    return this.findOne({id: id});
};


module.exports = UserSchema;