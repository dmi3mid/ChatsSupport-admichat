// const TelegramBot = require('node-telegram-bot-api');
// const ws = require('ws');
// require('dotenv').config();

// const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// const wss = new ws.Server({
//     port: process.env.PORT
// }, () => {
//     console.log(`Server is running in port ${process.env.PORT}`)
// })


// const clients = new Set();
// wss.on('connection', (ws) => {
//     clients.add(ws);
//     ws.on('close', () => clients.delete(ws));
// });

// bot.onText('/start', async (msg) => {
//     const chatId = msg.chat.id;
//     await bot.sendMessage(chatId, "Hi, this bot was created for technical support");
// });

// bot.on('text', async (msg) => {
//     const chatId = msg.chat.id;
//     const message = {
//         from: msg.from.username || msg.from.first_name || 'Unknown user',
//         text: msg.text,
//         chatId
//     };

//     const jsonMessage = JSON.stringify(message);
//     clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(jsonMessage);
//         }
//     });
// });


const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const wss = new WebSocket.Server({ port: process.env.PORT }, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Зберігаємо активні WebSocket-з'єднання
// const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Conection')
    // clients.add(ws);
    ws.on('close', () => wss.clients.delete(ws));
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Hi, this bot was created for technical support");
});

bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const message = {
        from: msg.from.username || msg.from.first_name || 'Unknown user',
        text: msg.text,
        chatId
    };

    // Відправляємо повідомлення всім підключеним React-клієнтам
    const jsonMessage = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonMessage);
        }
    });
});