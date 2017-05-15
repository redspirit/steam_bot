/**
 * Created by espri on 11.05.2017.
 */

var cheerio = require('cheerio');
var request = require('request-promise');
var s = require("underscore.string");
var _ = require("underscore");
var async = require("async");
var querystring = require('querystring');
var deferred = require('deferred');


var parsePage = function(q){

    _.defaults(q, {
        category1: 998,
        os: 'win',
        supportedlang: 'russian',
        sort_by: 'Name_ASC',
        specials: 1,
        page: 1
    });

    var query = querystring.stringify(q);

    var options = {
        uri: 'http://store.steampowered.com/search/results?' + query,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    console.log("URL", options.uri);

    return request(options)
        .then(function ($) {

            var list = [];

            $('.search_result_row').each(function(i, elem){

                var id = $(this).attr('data-ds-appid');
                var title = $(this).find('.search_name .title').text();
                var img = $(this).find('.search_capsule img').attr('src');
                var discount = $(this).find('.search_discount span').text();
                var priceOld = $(this).find('.search_price span strike').text();
                $(this).find('.search_price').children().remove();
                var price = $(this).find('.search_price').text();

                list.push({
                    id: id,
                    title: title,
                    img: s(img).replaceAll("capsule_sm_120", "header").value(),
                    discount: -parseInt(discount),
                    priceOld: priceOld,
                    price: s(price).trim().value()
                });

            });


            var pagesList = s($('.search_pagination_right').text() ).clean().value().split(' ').filter(function(item){
                return item != '>';
            }).map(function(item){
                return parseInt(item);
            });

            return {
                items: list,
                pages: _.last(pagesList)
            };

        })
        .catch(function (err) {
            console.log("ERR", err);
        });

};

var parseAll = function(q){

    var def = deferred();
    var first = parsePage({page:1});
    first.then(function(result){

        if(result.pages == 1)
            return def.resolve(result);

        var firstItems = result.items;

        var tasks = _.map(_.range(2, result.pages + 1), function(page){
            return function(cb){
                q.page = page;
                parsePage(q).then(function(res){
                    cb(null, res.items);
                }, function(err){
                    cb(err);
                });
            };
        });

        async.parallelLimit(tasks, 3, function(err, results){

            if(err)
                return def.reject(err);

            var items = firstItems;
            _.each(results, function(list){
                items = items.concat(list);
            });

            return def.resolve({
                items: items
            });

        });

    });

    return def.promise;

};

module.exports.parsePage = parsePage;
module.exports.parseAll = parseAll;