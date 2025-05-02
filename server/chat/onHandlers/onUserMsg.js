module.exports = async function onUserTelegramMsg(io, connections, data, messages) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Received Telegram user message:', parsedData);

        // Create standardized message object
        const message = {
            username: parsedData.username || 'Telegram User',
            room_id: parsedData.room_id,
            text: parsedData.text,
            from_admin: false,
            date: new Date(),
            is_bot_msg: true,
            message_id: parsedData.message_id
        };

        // Save message to database
        await messages.insertOne(message);

        // Forward to admin
        const adminSocketId = connections.get(`admin-${message.room_id}`);
        if (adminSocketId) {
            const jsonMessage = JSON.stringify({
                message,
                roomId: message.room_id
            });
            io.to(adminSocketId).emit('user-message', jsonMessage);
            console.log(`Telegram message forwarded to admin in room ${message.room_id}`);
        } else {
            console.log(`No admin connected for Telegram room ${message.room_id}`);
        }

    } catch (error) {
        console.error('Telegram user message error:', error);
    }
} 