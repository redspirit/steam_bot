/**
 * Created by espri on 11.05.2017.
 */

var parsing = require('./modules/parsing.js');


parsing.parsePage({}, 1).then(function(result){

    console.log("RES", result);

});
