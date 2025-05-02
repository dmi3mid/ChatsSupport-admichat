module.exports = async function onAdminMsg(io, connections, socket, data, messages) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Received admin web message:', parsedData);
        
        const { room, message } = parsedData;
        
        // Validate required fields
        const requiredFields = ['text'];
        const missingFields = requiredFields.filter(field => !message[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields in message: ${missingFields.join(', ')}`);
        }

        const userSocketId = connections.get(`user-${room}`);
        
        if (!userSocketId) {
            console.log('No user connected for room:', room);
            socket.emit('admin-message-error', {
                error: 'User is not connected',
                roomId: room
            });
            return;
        }

        // Create standardized message object
        const formattedMessage = {
            username: 'Admin', // You might want to get this from the admin's session
            room_id: room,
            text: message.text,
            from_admin: true,
            date: new Date(),
            is_bot_msg: false
        };

        // Save message to database
        await messages.insertOne(formattedMessage);

        // Send to user
        const jsonMessage = JSON.stringify(formattedMessage);
        io.to(userSocketId).emit('admin-message', jsonMessage);
        console.log(`Message sent to user in room ${room}`);

        // Confirm to admin
        socket.emit('updated-admin-message', JSON.stringify({
            message: formattedMessage,
            roomId: room,
            status: 'sent'
        }));

    } catch (error) {
        console.error('Admin web message error:', error);
        socket.emit('admin-message-error', {
            error: error.message || 'Failed to send message',
            roomId: parsedData?.room
        });
    }
} 