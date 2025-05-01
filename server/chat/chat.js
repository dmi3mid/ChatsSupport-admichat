const onAdminMsg = require('./onHandlers/onAdminMsg');
const onJoinRoom = require('./onHandlers/onJoinRoom');
// const onAdminClosedChat = require('./onHandlers/onAdminClosedChat');

const onUserMsg = require('./onHandlers/onHanlersWeb/onUserMsg');
const onStart = require('./onHandlers/onHanlersWeb/onStart');


function initWsConnection(io, connections, app, bot, users, messages) {
    io.on('connection', async (socket) => {
        console.log("Conection via socket.io");
    
        socket.on("join-room", (data) => {
            onJoinRoom(socket, connections, data);
        });
    
        socket.on('admin-message', (data) => {
            onAdminMsg(socket, data, bot, messages);
        });

        socket.on('admin-closed-chat', async (data) => {
            onAdminClosedChat(data, bot)
        })


        // for WebAPI of admichat;
        socket.on('start', (data) => {
            onStart(io, socket, connections, data, users);
        })

        socket.on('user-message', (data) => {
            onUserMsg(io, socket, connections, data, messages);
        });
    });
}

module.exports = {
    initWsConnection,
}