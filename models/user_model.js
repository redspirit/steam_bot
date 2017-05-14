/**
 * Created by espri on 12.05.2017.
 */

var mongoose = require('mongoose');
var _ = require('underscore');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    id: {
        type: Number
    },
    first_name: {
        type: String
    }
}, {
    versionKey: false
});


UserSchema.statics.saveUser = function (userInfo, callback) {

};
UserSchema.methods.humanFormat = function (d, mode) {

};

module.exports = UserSchema;