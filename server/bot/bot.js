const onStart = require('./onHandlers/onStart');
const onText = require('./onHandlers/onText');
const onEditedMessage = require('./onHandlers/onEditedMessage');


function initBot(bot, io, users, messages, connections) {
    bot.onText(/\/start/, (msg) => {
        onStart(msg, bot, io, users);
    });   
    
    bot.on('text', (msg) => {
        onText(msg, io, connections, messages);
    });
    
    bot.on('edited_message', (msg) => {
        onEditedMessage(msg, io, connections, messages);
    });
}

module.exports = {
    initBot
}