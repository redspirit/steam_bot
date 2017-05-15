/**
 * Created by espri on 26.09.2016.
 */
var TelegramBot = require('node-telegram-bot-api');
var config = require('./config.json').bot;

var bot = new TelegramBot(config.token, {polling: true});
bot.setWebHook('https://redspirit.ru:8443/bot' + config.token);
console.log('Set hook');