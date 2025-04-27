const onAdminMsg = require('./onHandlers/onAdminMsg');
const onEditClientMsg = require('./onHandlers/onEditClientMsg');
const onDeleteClientMsg = require('./onHandlers/onDeleteClientMsg');
const onJoinRoom = require('./onHandlers/onJoinRoom');


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
        })
    
        socket.on('del-msg-from-client', async (data) => {
            onDeleteClientMsg(data, bot, messages);
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
}

module.exports = {
    initWsConnection,
}