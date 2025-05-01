module.exports = async function onAdminMsg(io, connections, data, bot) {
    try {
        const parsedData = JSON.parse(data);
        console.log("parsed:", parsedData);
        if (connections.get(`user-${parsedData.room}`)) {
            io.to(connections.get(`user-${parsedData.room}`)).emit('admin-closed-chat', {
                from_admin: true,
                username: "admi3chatbot",
                date: Date.now(),
                text: "The admin has closed your chat. To get another help send call"
            });
        } else {
            await bot.sendMessage(parsedData.roomId, parsedData.message);
        }
    } catch (error) {
        console.log(error);
    }
}