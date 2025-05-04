const { ObjectId } = require('mongodb');
const DEFAULT_AUTO_REPLY_START = "Welcome! How can I help you today?";
const assignChatToAdmin = require('../../../utils/assignChatToAdmin');

module.exports = async function onStart(io, connections, data, users, admins, messages, adminId) {
    try {
        const parsedData = JSON.parse(data);
        const userId = parsedData._id;
        const userObj = {
            _id: userId,
            username: parsedData.username,
            isOpened: parsedData.isOpened,
        };
        // Use shared round-robin logic
        const settings = users.s.db.collection('settings');
        const assignedAdmin = await assignChatToAdmin(users, admins, settings, userId, userObj);

        // Only emit to assigned admin (room named after adminId)
        io.to(String(assignedAdmin._id)).emit('start', JSON.stringify({ ...userObj, assignedAdminId: assignedAdmin._id }));

        // Fetch admin's auto-reply and emit as admin-message
        if (assignedAdmin._id) {
            let autoReply = assignedAdmin.autoReplyStart ? assignedAdmin.autoReplyStart : DEFAULT_AUTO_REPLY_START;
            if (!assignedAdmin.autoReplyStart) {
                await admins.updateOne({ _id: assignedAdmin._id }, { $set: { autoReplyStart: autoReply } });
            }
            if (autoReply && autoReply.trim()) {
                for (const msgText of autoReply.split('\n\n')) {
                    const formattedMessage = {
                        room_id: userId,
                        from_admin: true,
                        message_id: undefined,
                        username: 'Admin',
                        date: new Date(),
                        text: msgText,
                        is_bot_msg: false
                    };
                    // Emit to assigned admin
                    io.to(String(assignedAdmin._id)).emit('admin-message', JSON.stringify(formattedMessage));
                    // Emit to the user's socket (if tracked in connections)
                    const userSocket = connections.get(String(userId));
                    if (userSocket) {
                        io.to(userSocket.id).emit('admin-message', JSON.stringify(formattedMessage));
                    }
                    await messages.insertOne(formattedMessage);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}
