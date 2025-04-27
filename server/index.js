require('dotenv').config();
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
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
let connections = new Map();
const client = new MongoClient("mongodb://localhost:27017/");
const users = client.db("admichat").collection("users");
const messages = client.db("admichat").collection("messages");

const { initBot } = require('./bot/bot');
const { initWsConnection } = require('./chat/chat');
const { initAuth } = require('./authorization/authorization');

async function start() {
    try {
        httpServer.listen(2800, () => {
            console.log("Http server is running");
        });
        await client.connect();
        console.log("Database is connected");
        initBot(bot, io, users, messages, connections);
        initWsConnection(io, connections, app, bot, users, messages);
        initAuth();
    } catch (error) {
        console.log(error);
    }
}
start();