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
        }
        const jsonData = JSON.stringify(user);
        io.emit('start', jsonData);
        if (!await users.findOne({ _id: userId })) users.insertOne(user);
        else console.log("Users already in database");

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