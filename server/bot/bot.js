const onStart = require('./onHandlers/onStart');
const onText = require('./onHandlers/onText');
const onCall = require('./onHandlers/onCall');


function initBot(bot, io, users, messages, connections) {
    if (bot._handlersInitialized) return;
    bot._handlersInitialized = true;

    bot.onText(/\/start/, (msg) => {
        onStart(msg, bot, io, users);
    });   
    
    bot.on('text', (msg) => {
        onText(msg, io, connections, messages);
    });

    bot.onText(/\/call/, (msg) => {
        onCall(msg, bot, io, connections, users);
    });
}

module.exports = {
    initBot
}