module.exports = async function (msg, bot, io, users) {
    try {
        const userId = msg.from.id;
        const chatId = msg.chat.id;
        const user = {
            _id: msg.from.id,
            username: msg?.from?.username || msg?.from?.first_name || `user${msg.from.id}`,
        }
        const jsonData = JSON.stringify(user);
        io.emit('start', jsonData);
        if (!await users.findOne({ _id: userId })) users.insertOne(user);
        else console.log("Users already in database");
        await bot.sendMessage(chatId, "Hi, this bot was created for technical support");
    } catch (error) {
        console.log(error);   
    }
}