const { ObjectId } = require('mongodb');
const DEFAULT_AUTO_REPLY_START = "Welcome! How can I help you today?";

module.exports = async function (msg, bot, io, users, admins, messages) {
    try {
        const userId = msg.from.id;
        const chatId = msg.chat.id;
        const user = {
            _id: msg.from.id,
            username: msg?.from?.username || msg?.from?.first_name || `user${msg.from.id}`,
            isOpened: true
        };

        // --- ROUND ROBIN ASSIGNMENT ---
        const settings = users.s.db.collection('settings');
        const allAdmins = await admins.find({ isActive: { $ne: false } }).sort({ _id: 1 }).toArray();
        if (!allAdmins.length) {
            console.log('No admins available for assignment');
            return;
        }
        const settingsDoc = await settings.findOne({ _id: 'roundRobin' });
        const lastIndex = settingsDoc ? settingsDoc.lastAssignedAdminIndex : -1;
        const nextIndex = (lastIndex + 1) % allAdmins.length;
        const assignedAdmin = allAdmins[nextIndex];
        // Assign to user
        user.assignedAdminId = assignedAdmin._id;
        await users.updateOne({ _id: userId }, { $set: user }, { upsert: true });
        // Update roundRobin
        await settings.updateOne({ _id: 'roundRobin' }, { $set: { lastAssignedAdminIndex: nextIndex } });
        // Only emit to assigned admin (emit to a room named after adminId)
        io.to(String(assignedAdmin._id)).emit('start', JSON.stringify(user));

        // --- END ROUND ROBIN ---

        // Fetch admin's auto-reply and send it
        const admin = await admins.findOne({ botToken: bot.token });
        let autoReply = admin && admin.autoReplyStart ? admin.autoReplyStart : DEFAULT_AUTO_REPLY_START;
        if (!admin.autoReplyStart) {
            await admins.updateOne({ _id: admin._id }, { $set: { autoReplyStart: autoReply } });
        }
        if (autoReply && autoReply.trim()) {
            // Support multi-line/messages (split by double newlines)
            for (const msgText of autoReply.split('\n\n')) {
                await bot.sendMessage(chatId, msgText, { parse_mode: 'Markdown' });
                // Save to DB if needed
                await messages.insertOne({
                    room_id: chatId,
                    from_admin: true,
                    message_id: undefined,
                    username: 'Admin',
                    date: new Date(),
                    text: msgText,
                    is_bot_msg: false
                });
            }
        }
    } catch (error) {
        console.log(error);   
    }
}