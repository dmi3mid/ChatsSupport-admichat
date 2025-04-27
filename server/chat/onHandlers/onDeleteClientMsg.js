module.exports = async function onDeleteClientMsg(data, bot, messages) {
    try {
        const parsedData = JSON.parse(data)
        await bot.deleteMessage(parsedData.roomId, parsedData.message.message_id);
        const filters = {
            room_id: parsedData.roomId,
            message_id: parsedData.message.message_id,
        }
        await messages.deleteOne(filters);
    } catch (error) {
        console.log(error);
    }
}