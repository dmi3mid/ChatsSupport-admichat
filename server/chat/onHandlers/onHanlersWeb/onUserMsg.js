module.exports = async function onUserMsg(io, socket, connections, data, messages) {
    try {
        const parsedData = JSON.parse(data);
        io.to(connections.get(parsedData.room_id)).emit('user-message', JSON.stringify({message: parsedData, roomId: parsedData.room_id}));
        await messages.insertOne(parsedData);
    } catch (error) {
        console.log(error);   
    }
}