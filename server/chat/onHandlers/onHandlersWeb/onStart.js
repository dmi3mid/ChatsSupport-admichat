const { ObjectId } = require('mongodb');
const DEFAULT_AUTO_REPLY_START = "Welcome! How can I help you today?";

module.exports = async function onStart(io, connections, data, users, admins, messages, adminId) {
    try {
        const parsedData = JSON.parse(data);
        const user = {
            _id: parsedData._id,
            username: parsedData.username,
            isOpened: parsedData.isOpened,
        }
        const jsonData = JSON.stringify(user);
        io.emit('start', jsonData);
        if (!await users.findOne({ _id: user._id })) users.insertOne(user);
        else console.log("Users already in database");

        // Fetch admin's auto-reply and emit as admin-message
        if (adminId) {
            const admin = await admins.findOne({ _id: new ObjectId(adminId) });
            let autoReply = admin && admin.autoReplyStart ? admin.autoReplyStart : DEFAULT_AUTO_REPLY_START;
            if (!admin.autoReplyStart) {
                await admins.updateOne({ _id: new ObjectId(adminId) }, { $set: { autoReplyStart: autoReply } });
            }
            if (autoReply && autoReply.trim()) {
                for (const msgText of autoReply.split('\n\n')) {
                    const formattedMessage = {
                        room_id: user._id,
                        from_admin: true,
                        message_id: undefined,
                        username: 'Admin',
                        date: new Date(),
                        text: msgText,
                        is_bot_msg: false
                    };
                    io.emit('admin-message', JSON.stringify(formattedMessage));
                    await messages.insertOne(formattedMessage);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}
