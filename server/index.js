require('dotenv').config();

const path = require('path');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// Bot manager singleton to store bot instances per token
const botInstances = new Map();

// Function to stop a bot instance
async function stopBotInstance(bot) {
    if (bot) {
        try {
            await bot.stopPolling();
            console.log('Bot polling stopped successfully');
        } catch (error) {
            console.error('Error stopping bot polling:', error);
        }
    }
}

// Function to create or get bot instance for a token
async function getBotInstance(token) {
    if (!token) return null;
    try {
        // Check if bot instance already exists for this token
        if (botInstances.has(token)) {
            return botInstances.get(token);
        }
        // Create new bot instance
        const newBot = new TelegramBot(token, { polling: true });
        await newBot.getMe();
        console.log(`Bot initialized successfully for token ${token}`);
        botInstances.set(token, newBot);
        return newBot;
    } catch (error) {
        console.error('Error creating bot instance:', error);
        return null;
    }
}

// Function to get bot instance for a token
function getBotByToken(token) {
    return botInstances.get(token);
}

// Function to remove bot instance for a token
async function removeBotInstanceByToken(token) {
    const bot = botInstances.get(token);
    if (bot) {
        await stopBotInstance(bot);
        botInstances.delete(token);
        console.log(`Bot instance removed for token ${token}`);
    }
}

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

// Add socket authentication middleware
io.use(async (socket, next) => {
    try {
        const adminId = socket.handshake.auth.adminId;
        console.log('Socket authentication attempt:', { adminId });
        
        if (adminId) {
            // Verify admin exists in database
            const admin = await admins.findOne({ _id: new ObjectId(adminId) });
            if (admin) {
                // Attach admin data to socket
                socket.adminId = adminId;
                console.log('Socket authenticated for admin:', adminId);
                return next();
            }
        }
        
        // Allow connection even without admin ID (for web users)
        console.log('Socket connected without admin authentication');
        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(error);
    }
});

let connections = new Map();
const client = new MongoClient("mongodb://localhost:27017/");
const users = client.db("admichat").collection("users");
const messages = client.db("admichat").collection("messages");
const admins = client.db("admichat").collection("admins");

const { initWsConnection } = require('./chat/chat');
const { initBot } = require('./bot/bot');
const { initAuth, register, login, getProfile } = require('./authorization/authorization');
const { promiseReadFile, promiseWriteFile } = require('./filesMethods/filesMethods');

// Add these routes before the start() function
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/profile', getProfile);

// Bot token management endpoints
app.post('/setBotToken', async (req, res) => {
    try {
        const { token } = req.body;
        const adminId = req.headers['admin-id'];
        
        if (!adminId) {
            return res.status(400).json({ error: 'Admin ID is required' });
        }

        // If token is null or empty, remove the bot association for this admin
        if (!token) {
            const admin = await admins.findOne({ _id: new ObjectId(adminId) });
            if (admin && admin.botToken) {
                // Check if any other admin is using this token
                const otherAdmins = await admins.find({ botToken: admin.botToken, _id: { $ne: new ObjectId(adminId) } }).toArray();
                if (otherAdmins.length === 0) {
                    await removeBotInstanceByToken(admin.botToken);
                }
            }
            await admins.updateOne(
                { _id: new ObjectId(adminId) },
                { $unset: { botToken: "" } }
            );
            return res.json({ success: true, message: 'Bot token removed successfully' });
        }

        // Update admin document with new token
        await admins.updateOne(
            { _id: new ObjectId(adminId) },
            { $set: { botToken: token } }
        );

        // Initialize or get bot instance for this token
        const botInstance = await getBotInstance(token);
        if (botInstance) {
            // Initialize bot handlers for this instance (only once)
            if (!botInstance._initialized) {
                initBot(botInstance, io, users, messages, connections);
                botInstance._initialized = true;
            }
            res.json({ success: true, message: 'Bot token updated successfully' });
        } else {
            res.status(400).json({ error: 'Failed to initialize bot with provided token' });
        }
    } catch (error) {
        console.error('Error setting bot token:', error);
        res.status(500).json({ error: 'Failed to set bot token' });
    }
});

app.get('/getBotToken', async (req, res) => {
    try {
        const adminId = req.headers['admin-id'];
        
        if (!adminId) {
            return res.status(400).json({ error: 'Admin ID is required' });
        }

        const admin = await admins.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({ token: admin.botToken || null });
    } catch (error) {
        console.error('Error getting bot token:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid admin ID format' });
        }
        res.status(500).json({ error: 'Failed to get bot token' });
    }
});

async function start() {
    try {
        httpServer.listen(2800, () => {
            console.log("Http server is running");
        });
        await client.connect();
        console.log("Database is connected");

        // Initialize WebSocket connection with bot manager
        initWsConnection(io, connections, app, { getBotByToken }, users, messages, admins);
        
        // Initialize any existing admin bots
        const adminBots = await admins.find({ botToken: { $exists: true } }).toArray();
        for (const admin of adminBots) {
            if (admin.botToken) {
                const botInstance = await getBotInstance(admin.botToken);
                if (botInstance) {
                    initBot(botInstance, io, users, messages, connections);
                }
            }
        }
        
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
        console.log(messagesData);
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

app.get('/messages/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const messagesData = await messages.find({ room_id: roomId }).sort({ date: 1 }).toArray();
        res.json(messagesData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});