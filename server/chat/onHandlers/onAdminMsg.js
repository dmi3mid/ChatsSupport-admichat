module.exports = async function onAdminMsg(socket, data, bot, messages) {
    try {
        let messageFromAdmin;
        const parsedData = JSON.parse(data); // message and room
        messageFromAdmin = parsedData.message;
        const sentMsgFromAdmin = await bot.sendMessage(parsedData.room, messageFromAdmin.text);
        messageFromAdmin.message_id = sentMsgFromAdmin.message_id;
        messageFromAdmin.room_id = sentMsgFromAdmin.chat.id;
        const jsonMessage = JSON.stringify({ message: messageFromAdmin, roomId: parsedData.room });
        socket.emit("updated-admin-message", jsonMessage);
        await messages.insertOne(messageFromAdmin);
    } catch (error) {
        console.log(error);
    }
}