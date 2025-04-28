module.exports = async function (msg, bot, io, collections, users) {
    try {
        const roomId = msg.from.id;
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, "Please wait for admin...");
        const foundUser = await users.findOne({_id: roomId});
        if (!foundUser.isOpened) await users.updateOne({_id: roomId}, {$set: {isOpened: true}});
    } catch (error) {
        console.log(error);
    }
}