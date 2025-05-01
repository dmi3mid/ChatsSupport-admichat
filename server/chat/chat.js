const onAdminMsg = require('./onHandlers/onAdminMsg');
const onJoinRoom = require('./onHandlers/onJoinRoom');
// const onAdminClosedChat = require('./onHandlers/onAdminClosedChat');

const onUserMsg = require('./onHandlers/onHanlersWeb/onUserMsg');
const onStart = require('./onHandlers/onHanlersWeb/onStart');
const onCall = require('./onHandlers/onHanlersWeb/onCall');


function initWsConnection(io, connections, app, bot, users, messages) {
    io.on('connection', async (socket) => {
        console.log("Conection via socket.io");
    
        socket.on("join-room", (data) => {
            onJoinRoom(socket, connections, data);
        });
    
        socket.on('admin-message', (data) => {
            onAdminMsg(io, connections, socket, data, bot, messages);
        });

        // socket.on('admin-closed-chat', async (data) => {
        //     onAdminClosedChat(io, connections, data, bot)
        // })


        // for WebAPI of admichat;
        socket.on('start', (data) => {
            onStart(io, socket, connections, data, users);
        })

        socket.on('user-message', (data) => {
            onUserMsg(io, socket, connections, data, messages);
        });

        socket.on('call', (data) => {
            onCall(io, connections, data, users);
        })
    });
}

module.exports = {
    initWsConnection,
}