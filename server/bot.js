const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});


bot.onText('/start', async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Hi, this bot was created for technical support");
});