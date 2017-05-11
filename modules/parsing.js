/**
 * Created by espri on 11.05.2017.
 */

var cheerio = require('cheerio');
var request = require('request-promise');
var s = require("underscore.string");
var querystring = require('querystring');


var parsePage = function(q, page){

    var query = querystring.stringify({
        category1: 998,
        os: 'win',
        supportedlang: 'russian',
        specials: 1,
        page: page
    });

    var options = {
        uri: 'http://store.steampowered.com/search/results?' + query,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

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
                    discount: discount,
                    priceOld: priceOld,
                    price: s(price).trim().value()
                });

            });

            var lastPage = $('.search_pagination_right').children().last().prev().text();

            return {
                items: list,
                pages: lastPage
            };

        })
        .catch(function (err) {
            console.log("ERR", err);
        });

};

var parseAll = function(q){

};

module.exports.parsePage = parsePage;
module.exports.parseAll = parseAll;