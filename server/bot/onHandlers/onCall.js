module.exports = async function (msg, bot, io, connections, users) {
    try {
        const roomId = msg.from.id;
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, "Please wait for admin...");
        io.to(connections.get(roomId)).emit('call', JSON.stringify({
            _id: roomId,
            username: msg?.from?.username || msg?.from?.first_name,
            isOpened: true,
        }))
        const foundUser = await users.findOne({_id: roomId});
        if (!foundUser.isOpened) await users.updateOne({_id: roomId}, {$set: {isOpened: true}});
    } catch (error) {
        console.log(error);
    }
}