module.exports = async function onText(msg, io, connections, messages) {
    try {
        if (msg.text !== '/call') {
            const message = {
                room_id: msg.from.id,
                from_admin: false,
                message_id: msg.message_id,
                username: msg.from.username || msg.from.first_name || 'Unknown user',
                date: new Date(),
                text: msg.text,
                is_bot_msg: true,
            };
            
            const roomId = msg.from.id;
            const adminSocketId = connections.get(`admin-${roomId}`);
            
            if (adminSocketId) {
                console.log('Forwarding Telegram message to admin:', message);
                const jsonMessage = JSON.stringify({ message, roomId });
                io.to(adminSocketId).emit('user-message', jsonMessage);
            } else {
                console.log('No admin connected for room:', roomId);
            }
            
            await messages.insertOne(message);
        }
    } catch (error) {
        console.error('Error handling Telegram message:', error);
    }
}