const { ObjectId } = require('mongodb');

module.exports = async function onAdminMsg(io, connections, socket, data, botManager, messages, admins) {
    let parsedData;
    try {
        // Get admin ID from socket
        const adminId = socket.adminId;
        console.log('Processing admin message:', { 
            adminId,
            socketId: socket.id,
            hasAuth: !!socket.adminId
        });

        if (!adminId) {
            throw new Error('Admin authentication required. Please log in again.');
        }

        // Fetch admin's token from the database
        const admin = await admins.findOne({ _id: new ObjectId(adminId) });
        if (!admin || !admin.botToken) {
            throw new Error('No bot token associated with this admin.');
        }
        const bot = botManager.getBotByToken(admin.botToken);
        console.log('Bot instance status:', {
            token: admin.botToken,
            hasBot: !!bot
        });
        if (!bot) {
            throw new Error('Bot instance not found for this token. Please check your bot token in settings.');
        }

        // Parse and validate incoming data
        try {
            parsedData = JSON.parse(data);
            console.log('Received Telegram message:', parsedData);
        } catch (parseError) {
            throw new Error('Invalid message format: failed to parse JSON data');
        }
        
        if (!parsedData || !parsedData.room || !parsedData.message) {
            throw new Error('Invalid message format: missing required fields');
        }
        
        const { room, message } = parsedData;
        
        // Validate message content
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
            try {
                // Send message to Telegram with error handling
                const sentMsgFromAdmin = await bot.sendMessage(room, message.text);
                if (!sentMsgFromAdmin) {
                    throw new Error('Failed to send message to Telegram');
                }
                message.room_id = sentMsgFromAdmin.chat.id;
                message.message_id = sentMsgFromAdmin.message_id;
            } catch (telegramError) {
                console.error('Telegram API error:', telegramError);
                throw new Error(`Failed to send message to Telegram: ${telegramError.message}`);
            }
        }

        // Save message in unified schema
        const formattedMessage = {
            room_id: room,
            from_admin: true,
            message_id: message.message_id,
            username: 'Admin',
            date: new Date(),
            text: message.text,
            is_bot_msg: false
        };

        // Save message to database
        await messages.insertOne(formattedMessage);

        // Confirm to admin
        const confirmMessage = JSON.stringify({
            message: formattedMessage,
            roomId: room,
            status: 'sent'
        });
        socket.emit("updated-admin-message", confirmMessage);

    } catch (error) {
        console.error('Admin message error:', {
            error: error.message,
            adminId: socket.adminId,
            socketId: socket.id
        });
        
        // Ensure we have a valid room ID for the error response
        const roomId = parsedData?.room || 'unknown';
        socket.emit('admin-message-error', {
            error: error.message || 'Failed to send message',
            roomId: roomId
        });
    }
}