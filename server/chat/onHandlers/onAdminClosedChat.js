module.exports = async function onAdminMsg(data, bot) {
    try {
        const parsedData = JSON.parse(data);
        console.log("parsed:", parsedData);
        await bot.sendMessage(parsedData.roomId, parsedData.message);
    } catch (error) {
        console.log(error);
    }
}