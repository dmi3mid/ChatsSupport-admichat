module.exports = function onJoinRoom(socket, connections, data) {
    try {
        const parsedData = JSON.parse(data);
        connections.set(parsedData.roomId, socket.id);   
    } catch (error) {
        console.log(error);
    }
}