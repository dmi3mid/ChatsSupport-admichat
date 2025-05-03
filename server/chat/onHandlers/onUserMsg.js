module.exports = async function onUserTelegramMsg(io, connections, data, messages) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Received Telegram user message:', parsedData);

        // Save message in unified schema
        const formattedMessage = {
            room_id: parsedData.room_id,
            from_admin: false,
            message_id: parsedData.message_id,
            username: parsedData.username || 'Telegram User',
            date: new Date(),
            text: parsedData.text,
            is_bot_msg: true
        };
        await messages.insertOne(formattedMessage);

        // Forward to admin
        const adminSocketId = connections.get(`admin-${parsedData.room_id}`);
        if (adminSocketId) {
            const jsonMessage = JSON.stringify({
                message: formattedMessage,
                roomId: parsedData.room_id
            });
            io.to(adminSocketId).emit('user-message', jsonMessage);
            console.log(`Telegram message forwarded to admin in room ${parsedData.room_id}`);
        } else {
            console.log(`No admin connected for Telegram room ${parsedData.room_id}`);
        }

    } catch (error) {
        console.error('Telegram user message error:', error);
    }
} 