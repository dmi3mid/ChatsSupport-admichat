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
        if (connections.get(`user-${headers.roomid}`)) {
            io.to(connections.get(`user-${headers.roomid}`)).emit('admin-closed-chat', JSON.stringify({
                from_admin: true,
                username: "admi3chatbot",
                date: Date.now(),
                text: "The admin has closed your chat. To get another help send call"
            }));
        } else {
            await bot.sendMessage(Number(headers.roomid), "The admin has closed your chat. To get another help send /call");
        }
    } catch (error) {
        console.log(error);
    }
})



app.get('/getBotToken', async (req, res) => {
    try {
        const filters = {
            username: req.headers.username || "Unknown user"
        }
        const adminData = await admins.findOne(filters);
        res.send(JSON.stringify({ token: adminData.token }));
    } catch (error) {
        console.log(error);
    }
});
app.post('/setBotToken', async (req, res) => {
    try {
        const headers = req.headers
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
        console.log(newToken);
        envVars["BOT_TOKEN"] = newToken;

        const newEnvContent = Object.entries(envVars)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        // console.log(newEnvContent);
        // const writer = await promiseWriteFile(pathToFile, newEnvContent);


        const filters = {
            username: adminData.username
        }
        const updatedData = {
            $set: {
                token: newToken
            }
        }
        await admins.updateOne(filters, updatedData);
    } catch (error) {
        console.log(error);
    }
});
app.post('/removeBotToken', async (req, res) => {

});