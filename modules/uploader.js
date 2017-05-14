/**
 * Created by espri on 14.05.2017.
 */

var request = require('request');
var fs = require('fs');
var deferred = require('deferred');


var load = function(url, id){

    var def = deferred();
    var filename = __dirname + '/../files/' + id +'.jpg';

    request(url).on('end', function(){
        def.resolve('ok');
    }).on('error', function(err){
        def.reject(err);
    }).pipe(fs.createWriteStream(filename));

    return def.promise;
};

module.exports.load = load;