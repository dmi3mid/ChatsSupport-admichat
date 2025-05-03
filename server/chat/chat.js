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

        socket.on('admin-closed-chat', async (data) => {
            onAdminClosedChat(io, connections, data, bot)
        });
        
        socket.on('start', (data) => {
            onStart(io, connections, data, users);
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