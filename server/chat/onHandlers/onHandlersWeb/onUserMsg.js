module.exports = async function onUserWebMsg(io, connections, socket, data, messages) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Received web user message:', parsedData);

        // Validate required fields
        const requiredFields = ['username', 'room_id', 'text'];
        const missingFields = requiredFields.filter(field => !parsedData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Create standardized message object
        const message = {
            username: parsedData.username,
            room_id: parsedData.room_id,
            text: parsedData.text,
            from_admin: false,
            date: new Date(),
            is_bot_msg: false
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
            console.log(`Web message forwarded to admin in room ${message.room_id}`);
        } else {
            console.log(`No admin connected for web room ${message.room_id}`);
        }

    } catch (error) {
        console.error('Web user message error:', error);
        if (socket) {
            socket.emit('user-message-error', {
                error: error.message || 'Failed to send message'
            });
        }
    }
}
