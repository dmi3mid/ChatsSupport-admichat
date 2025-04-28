const onAdminMsg = require('./onHandlers/onAdminMsg');
const onEditClientMsg = require('./onHandlers/onEditClientMsg');
const onDeleteClientMsg = require('./onHandlers/onDeleteClientMsg');
const onJoinRoom = require('./onHandlers/onJoinRoom');
// const onAdminClosedChat = require('./onHandlers/onAdminClosedChat');


function initWsConnection(io, connections, app, bot, users, messages) {
    io.on('connection', async (socket) => {
        console.log("Conection via socket.io");
    
        socket.on("join-room", async (data) => {
            onJoinRoom(socket, connections, data);
        });
    
        socket.on('admin-message', (data) => {
            onAdminMsg(socket, data, bot, messages);
        });
    
        socket.on('edit-msg-from-client', async (data) => {
            onEditClientMsg(data, bot, messages);
        });
    
        socket.on('del-msg-from-client', async (data) => {
            onDeleteClientMsg(data, bot, messages);
        });

        // socket.on('admin-closed-chat', async (data) => {
        //     onAdminClosedChat(data, bot)
        // })
    });
}

module.exports = {
    initWsConnection,
}