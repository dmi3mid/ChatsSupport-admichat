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

// Middleware
app.use(cors());
app.use(express.json());

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
const admins = client.db("admichat").collection("admins");

const { initWsConnection } = require('./chat/chat');
const { initBot } = require('./bot/bot');
const { initAuth, router: authRouter } = require('./authorization/authorization');
const { promiseReadFile, promiseWriteFile } = require('./filesMethods/filesMethods');

async function start() {
    try {
        httpServer.listen(2800, () => {
            console.log("Http server is running");
        });
        await client.connect();
        console.log("Database is connected");
        
        // Initialize authentication
        const { verifyToken } = initAuth(admins);
        
        // Protected routes
        app.get('/getUsers', verifyToken, async (req, res) => {
            try {
                const usersData = await users.find({}).toArray();
                res.send(JSON.stringify(usersData));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server error" });
            }
        });

        app.get('/getMessages', verifyToken, async (req, res) => {
            try {
                const messagesData = await messages.find({}).limit(30).toArray();
                res.send(JSON.stringify(messagesData));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server error" });
            }
        });

        app.post('/closeChat', verifyToken, async (req, res) => {
            try {
                const headers = req.headers;
                const isOpened = req.body.isOpened;
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
                res.json({ message: "Chat closed successfully" });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server error" });
            }
        });

        app.get('/getBotToken', verifyToken, async (req, res) => {
            try {
                const filters = {
                    username: req.headers.username || "Unknown user"
                }
                const adminData = await admins.findOne(filters);
                res.send(JSON.stringify({ token: adminData.token }));
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server error" });
            }
        });

        app.post('/setBotToken', verifyToken, async (req, res) => {
            try {
                const headers = req.headers;
                const adminData = {
                    username: headers.username
                }
                const newToken = req.body.token;

                const pathToFile = path.join(__dirname, ".env");
                const envContent = await promiseReadFile(pathToFile);
                const envVars = {};
                envContent.split('\n').forEach(line => {
                    const [key, value] = line.split('=');
                    if (key) {
                        envVars[key.trim()] = value ? value.trim() : '';
                    }
                });

                envVars["BOT_TOKEN"] = newToken;

                const newEnvContent = Object.entries(envVars)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('\n');

                const filters = {
                    username: adminData.username
                }
                const updatedData = {
                    $set: {
                        token: newToken
                    }
                }
                await admins.updateOne(filters, updatedData);
                res.json({ message: "Bot token updated successfully" });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server error" });
            }
        });

        app.use('/api', (req, res, next) => {
            req.db = admins;
            next();
        }, authRouter);

        initWsConnection(io, connections, app, bot, users, messages);
        initBot(bot, io, users, messages, connections);
    } catch (error) {
        console.log(error);
    }
}

start();