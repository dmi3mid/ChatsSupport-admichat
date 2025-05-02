require('dotenv').config();

const path = require('path');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');



const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const app = express();
const httpServer = http.createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
let connections = new Map();
const client = new MongoClient("mongodb://localhost:27017/");
const users = client.db("admichat").collection("users");
const messages = client.db("admichat").collection("messages");
const admins = client.db("admichat").collection("admins");

const { initWsConnection } = require('./chat/chat');
const { initBot } = require('./bot/bot');
const { initAuth } = require('./authorization/authorization');
const { promiseReadFile, promiseWriteFile } = require('./filesMethods/filesMethods');

async function start() {
    try {
        httpServer.listen(2800, () => {
            console.log("Http server is running");
        });
        await client.connect();
        console.log("Database is connected");
        initWsConnection(io, connections, app, bot, users, messages);
        initBot(bot, io, users, messages, connections);
        initAuth(admins);
    } catch (error) {
        console.log(error);
    }
}
start();


app.get('/getUsers', async (req, res) => {
    try {
        const usersData = await users.find({}).toArray();
        res.send(JSON.stringify(usersData));
    }
    catch (error) {
        console.log(error);
    }

});
app.get('/getMessages', async (req, res) => {
    try {
        const messagesData = await messages.find({}).limit(30).toArray();
        res.send(JSON.stringify(messagesData));
    }
    catch (error) {
        console.log(error)
    }
});
app.post('/closeChat', async (req, res) => {
    try {
        const headers = req.headers;
        console.log(Number(headers.roomid));
        const isOpened = req.body.isOpened;
        console.log(isOpened)
        const filters = {
            _id: Number(headers.roomid)
        }
        const updatedData = {
            $set: {
                isOpened: isOpened
            }
        }
        await users.updateOne(filters, updatedData);
        await bot.sendMessage(Number(headers.roomid), "The admin has closed your chat. To get another help send /call");
    } catch (error) {
        console.log(error);
    }
});