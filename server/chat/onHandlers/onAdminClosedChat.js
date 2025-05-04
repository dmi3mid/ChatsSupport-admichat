const { ObjectId } = require('mongodb');

module.exports = async function onAdminClosedChat(io, connections, data, botManager, users, messages, admins) {
    try {
        let parsedData = data;
        if (typeof data === 'string') parsedData = JSON.parse(data);
        const { roomId, adminId } = parsedData;
        if (!roomId || !adminId) {
            console.log('[onAdminClosedChat] Missing roomId or adminId:', { roomId, adminId });
            return;
        }
        // Update chat/user status in DB
        await users.updateOne(
            { _id: roomId },
            { $set: { isOpened: false, status: 'closed' } }
        );
        // Prepare closure message
        const closureMsg = "This chat has been closed by the support team. Thank you for contacting us!";
        const messagePayload = {
            room_id: roomId,
            from_admin: true,
            username: 'Support',
            date: new Date(),
            text: closureMsg,
            is_system_message: true
        };
        // Only emit to web chat user if their socket exists
        const userSocket = connections.get(String(roomId));
        console.log('[onAdminClosedChat] userSocket for roomId', roomId, ':', userSocket ? userSocket.id : 'NOT FOUND');
        if (userSocket) {
            io.to(userSocket.id).emit('admin-message', JSON.stringify(messagePayload));
            console.log(`[onAdminClosedChat] Notified web user (roomId: ${roomId}) via socket.`);
        } else {
            // Try Telegram
            const admin = await admins.findOne({ _id: new ObjectId(adminId) });
            if (admin && admin.botToken) {
                const bot = botManager.getBotByToken(admin.botToken);
                if (bot) {
                    await bot.sendMessage(roomId, closureMsg);
                    console.log(`[onAdminClosedChat] Notified Telegram user (roomId: ${roomId}) via bot.`);
                } else {
                    console.log(`[onAdminClosedChat] No bot instance for adminId: ${adminId}`);
                }
            } else {
                console.log(`[onAdminClosedChat] No botToken for adminId: ${adminId}`);
            }
        }
        // Emit globally for debugging
        io.emit('admin-message', JSON.stringify(messagePayload));
        console.log('[onAdminClosedChat] Emitted admin-message globally for debugging.');
        // Store the closure message in the DB
        await messages.insertOne(messagePayload);
    } catch (error) {
        console.error('[onAdminClosedChat] Error:', error);
    }
}