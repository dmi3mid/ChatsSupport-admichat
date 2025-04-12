const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
const { MongoClient, ObjectId } = require('mongodb');
const uniqid = require('uniqid');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const wss = new WebSocket.Server({ port: process.env.PORT }, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
const client = new MongoClient("mongodb://localhost:27017/");
const users = client.db("admichat").collection("users");
const messages = client.db("admichat").collection("messages");

wss.on('connection', (ws) => {
    console.log('Conection')
    ws.on('close', () => wss.clients.delete(ws));
});

bot.onText(/\/start/, async (msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    const user = {
        _id: msg.from.id,
        isMessage: false,
        username: msg.from.username,
        fname: msg.from.first_name,
    }

    // const jsonUser = JSON.stringify(user)
    // wss.clients.forEach(client => {
    //     if (client.readyState === WebSocket.OPEN) {
    //         client.send(jsonUser);
    //     }
    // });

    try {
        await client.connect();
        console.log("Database is connected");
        if (!await users.findOne({_id: userId})) users.insertOne(user);
        else console.log("Users already in database");
    } catch (error) {
        console.log(error);
    }
    await bot.sendMessage(chatId, "Hi, this bot was created for technical support");   
});

bot.on('text', async (msg) => {
    const message = {
        _id: new ObjectId(),
        fromId: msg.from.id,
        from: msg.from.username || msg.from.first_name || 'Unknown user',
        date: msg.date,
        text: msg.text,
    };

    const jsonMessage = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonMessage);
        }
    });

    try {
        await client.connect();
        console.log("Database is connected");
        messages.insertOne(message);
    } catch (error) {
        console.log(error);
    }
});