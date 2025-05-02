module.exports = async function onAdminMsg(io, connections, socket, data, bot, messages) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Received Telegram message:', parsedData);
        
        const { room, message } = parsedData;
        
        // Validate required fields
        if (!message.text) {
            throw new Error('Message text is required');
        }

        // Check if user is connected via WebSocket
        const userSocketId = connections.get(`user-${room}`);
        if (userSocketId) {
            console.log('User connected via WebSocket, sending message to room:', room);
            message.room_id = room;
            const jsonMessage = JSON.stringify(message);
            io.to(userSocketId).emit('admin-message', jsonMessage);
        } else {
            console.log('Sending message to Telegram chat:', room);
            // Send message to Telegram
            const sentMsgFromAdmin = await bot.sendMessage(room, message.text);
            message.room_id = sentMsgFromAdmin.chat.id;
        }

        // Save message to database
        await messages.insertOne(message);

        // Confirm to admin
        const confirmMessage = JSON.stringify({
            message,
            roomId: room,
            status: 'sent'
        });
        socket.emit("updated-admin-message", confirmMessage);

    } catch (error) {
        console.error('Telegram message error:', error);
        socket.emit('admin-message-error', {
            error: error.message || 'Failed to send message',
            roomId: parsedData?.room
        });
    }
}