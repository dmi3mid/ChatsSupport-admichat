const onAdminTelegramMsg = require('./onHandlers/onAdminMsg');
const onAdminWebMsg = require('./onHandlers/onHandlersWeb/onAdminMsg');
const onUserTelegramMsg = require('./onHandlers/onUserMsg');
const onUserWebMsg = require('./onHandlers/onHandlersWeb/onUserMsg');
const onJoinRoom = require('./onHandlers/onJoinRoom');
const onAdminClosedChat = require('./onHandlers/onAdminClosedChat');
const onStart = require('./onHandlers/onHandlersWeb/onStart');

function initWsConnection(io, connections, app, bot, users, messages, admins) {
    io.on('connection', async (socket) => {
        console.log("Connection via socket.io");
    
        socket.on("join-room", (data) => {
            // Parse data to get roomId (user's _id for web chat)
            let parsedData = data;
            if (typeof data === 'string') {
                parsedData = JSON.parse(data);
            }
            // Register the user's socket for web chat
            if (parsedData && parsedData.roomId) {
                connections.set(String(parsedData.roomId), socket);
                console.log('Registered user socket for roomId:', parsedData.roomId, 'socketId:', socket.id);
            }
            onJoinRoom(socket, connections, data);
        });
    
        // Handle admin messages based on context
        socket.on('admin-message', (data) => {
            const parsedData = JSON.parse(data);
            console.log('Received admin message:', parsedData);
            
            // Check if this is a web chat message
            if (parsedData.isWebChat) {
                console.log('Routing to web admin handler');
                onAdminWebMsg(io, connections, socket, data, messages);
            } else {
                console.log('Routing to Telegram admin handler');
                onAdminTelegramMsg(io, connections, socket, data, bot, messages, admins);
            }
        });

        socket.on('admin-closed-chat', (data) => {
            onAdminClosedChat(io, connections, data, bot, users, messages, admins);
        });
        
        socket.on('start', (data) => {
            onStart(io, connections, data, users, admins, messages, socket.adminId);
        });
        
        socket.on('user-message', (data) => {
            const parsedData = JSON.parse(data);
            console.log('Received user message:', parsedData);
            
            // Check if this is a web chat message
            if (parsedData.isWebChat) {
                console.log('Routing to web user handler');
                onUserWebMsg(io, connections, socket, data, messages);
            } else {
                console.log('Routing to Telegram user handler');
                onUserTelegramMsg(io, connections, data, messages);
            }
        });
    });
}

module.exports = {
    initWsConnection,
}