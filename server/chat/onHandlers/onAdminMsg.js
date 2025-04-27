module.exports = async function onAdminMsg(socket, data, bot, messages) {
    try {
        let messageFromAdmin;
        const parsedData = JSON.parse(data); // message and room
        messageFromAdmin = parsedData.message;
        const sentMsgFromAdmin = await bot.sendMessage(parsedData.room, messageFromAdmin.text, {
            reply_to_message_id: messageFromAdmin?.replied_message?.message_id || null
        });
        delete messageFromAdmin.replied_message;
        messageFromAdmin.message_id = sentMsgFromAdmin.message_id;
        messageFromAdmin.room_id = sentMsgFromAdmin.chat.id;
        messageFromAdmin.edited = false;
        messageFromAdmin.replied_message = {
            from_admin: sentMsgFromAdmin?.reply_to_message?.from?.is_bot || false,
            message_id: sentMsgFromAdmin?.reply_to_message?.message_id || 0,
            username: sentMsgFromAdmin?.reply_to_message?.from.username || sentMsgFromAdmin?.reply_to_message?.from?.first_name || "Unknown user",
            date: sentMsgFromAdmin?.reply_to_message?.date || 0,
            text: sentMsgFromAdmin?.reply_to_message?.text || "",
        };
        const jsonMessage = JSON.stringify({ message: messageFromAdmin, roomId: parsedData.room });
        socket.emit("updated-admin-message", jsonMessage);
        await messages.insertOne(messageFromAdmin);
    } catch (error) {
        console.log(error);
    }
}