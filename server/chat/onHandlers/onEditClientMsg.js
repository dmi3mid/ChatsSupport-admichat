module.exports = async function onEditClientMsg(data, bot, messages) {
    const parsedData = JSON.parse(data)
    try {
        await bot.editMessageText(parsedData.message.text, {
            chat_id: parsedData.roomId,
            message_id: parsedData.message.message_id,
        });
        const filters = {
            room_id: parsedData.roomId,
            message_id: parsedData.message.message_id
        }
        const updatedMessage = {
            $set: {
                text: parsedData.message.text,
                edited: true,
            }
        }
        await messages.updateOne(filters, updatedMessage);
    } catch (error) {
        console.log(error);
    }
}