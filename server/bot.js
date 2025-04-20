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
        const parsedData = JSON.parse(data); // message and room
        messageFromAdmin = parsedData.message;
        const sentMsgFromAdmin = await bot.sendMessage(parsedData.room, messageFromAdmin.text, {
            reply_to_message_id: messageFromAdmin?.replied_message?.message_id || null
        });
        messageFromAdmin.message_id = sentMsgFromAdmin.message_id;
        messageFromAdmin.room_id = sentMsgFromAdmin.chat.id;
        delete messageFromAdmin.replied_message;
        messageFromAdmin.replied_message = {
            from_admin: sentMsgFromAdmin?.reply_to_message?.from?.is_bot || false,
            message_id: sentMsgFromAdmin?.reply_to_message?.message_id || 0,
            username: sentMsgFromAdmin?.reply_to_message?.from.username || sentMsgFromAdmin?.reply_to_message?.from?.first_name || "Unknown user",
            date: sentMsgFromAdmin?.reply_to_message?.date || 0,
            text: sentMsgFromAdmin?.reply_to_message?.text || "",
        };
        const jsonMessage = JSON.stringify({message: messageFromAdmin, roomId: parsedData.room});
        io.emit("updated-admin-message", jsonMessage);
        try {
            await client.connect();
            console.log("Database is connected");
            delete messageFromAdmin.repliedMessage;
            messages.insertOne(messageFromAdmin);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("join_room", async (roomId) => {
        console.log(roomId);
    })
});

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
})


bot.onText(/\/start/, async (msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    const user = {
        _id: msg.from.id,
        username: msg?.from?.username || msg?.from?.first_name || `user${msg.from.id}`,
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
        room_id: msg.from.id,
        from_admin: false,
        message_id: msg.message_id,
        username: msg.from.username || msg.from.first_name || 'Unknown user',
        date: msg.date,
        text: msg.text,
        replied_message: {
            from_admin: msg?.reply_to_message?.from?.is_bot || false,
            message_id: msg?.reply_to_message?.message_id || 0,
            username: msg?.reply_to_message?.from.username || msg?.reply_to_message?.from?.first_name || "Unknown user",
            date: msg?.reply_to_message?.date || 0,
            text: msg?.reply_to_message?.text || "",
        },
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

bot.on('edited_message', async (msg) => {
    // console.log(msg.from.id);
    const roomId = msg.from.id;
    const messageId = msg.message_id;
    const editedMsg = {
        text: msg.text,
        messageId: msg.message_id
    }
    const jsonEditedMsg = JSON.stringify({editedMsg, roomId});
    io.emit('edit-msg-from-bot', jsonEditedMsg);
    try {
        await client.connect();
        console.log("Database is connected");
        const filters = {
            room_id: roomId,
            message_id: messageId
        }
        const updatedMessage = {
            $set: {
                text: editedMsg.text
            }
        }
        await messages.updateOne(filters, updatedMessage);
    } catch (error) {
        console.log(error);
    }
})