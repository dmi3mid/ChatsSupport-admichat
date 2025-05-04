const { ObjectId } = require('mongodb');

module.exports = async function onCall(io, connections, data, users) {
    try {
        let parsedData = data;
        if (typeof data === 'string') parsedData = JSON.parse(data);
        const userId = parsedData.userId || parsedData.roomId || parsedData._id;
        if (!userId) {
            console.log('[onCall] Missing userId/roomId in data:', data);
            return;
        }
        // Update chat/session in DB
        await users.updateOne(
            { _id: userId },
            { $set: { isOpened: true } }
        );
        // Prepare and emit message
        const userSocket = connections.get(String(userId));
        const msg = {
            room_id: userId,
            from_admin: true,
            username: 'Support',
            date: new Date(),
            text: 'Please wait for admin...',
            is_system_message: true
        };
        if (userSocket) {
            io.to(userSocket.id).emit('admin-message', JSON.stringify(msg));
            console.log(`[onCall] Sent 'Please wait for admin...' to userId: ${userId}`);
        } else {
            console.log(`[onCall] No active socket for userId: ${userId}`);
        }
    } catch (error) {
        console.error('[onCall] Error:', error);
    }
} 