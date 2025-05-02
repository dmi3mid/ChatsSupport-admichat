const onAdminMsg = require('./onHandlers/onAdminMsg');
const onJoinRoom = require('./onHandlers/onJoinRoom');
const onAdminClosedChat = require('./onHandlers/onAdminClosedChat');



function initWsConnection(io, connections, app, bot, users, messages) {
    io.on('connection', async (socket) => {
        console.log("Conection via socket.io");
    
        socket.on("join-room", (data) => {
            onJoinRoom(socket, connections, data);
        });
    
        socket.on('admin-message', (data) => {
            onAdminMsg(io, connections, socket, data, bot, messages);
        });

        socket.on('admin-closed-chat', async (data) => {
            onAdminClosedChat(io, connections, data, bot)
        })
    });
}

module.exports = {
    initWsConnection,
}