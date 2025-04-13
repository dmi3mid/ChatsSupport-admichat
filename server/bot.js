const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
app.use(cors());
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
httpServer.listen(2800, () => {
    console.log("Http server is running");
});

const { MongoClient, ObjectId } = require('mongodb');
const uniqid = require('uniqid');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const client = new MongoClient("mongodb://localhost:27017/");
const users = client.db("admichat").collection("users");
const messages = client.db("admichat").collection("messages");

let messageFromAdmin;
io.on('connection', async (socket) => {
    console.log("Conection via socket.io");
    socket.on('admin-message', async (data) => {
        const parsedData = JSON.parse(data);
        messageFromAdmin = parsedData.message;
        try {
            await client.connect();
            console.log("Database is connected");

            messages.insertOne(messageFromAdmin);
        } catch (error) {
            console.log(error);
        }
        bot.sendMessage(parsedData.room, messageFromAdmin.text);
    });

    socket.on("join_room", async (roomId) => {
        console.log(roomId);
    })
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
        fromAdmin: false,
        username: msg.from.username || msg.from.first_name || 'Unknown user',
        date: msg.date,
        text: msg.text,
    };
    
    const roomId = msg.from.id;
    const jsonMessage = JSON.stringify({message, roomId});
    io.emit('user-message', jsonMessage);

    try {
        await client.connect();
        console.log("Database is connected");
        messages.insertOne(message);
    } catch (error) {
        console.log(error);
    }
});