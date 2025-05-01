module.exports = function onJoinRoom(socket, connections, data) {
    try {
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        connections.set(parsedData.roomId, socket.id);   
        console.log(connections);
    } catch (error) {
        console.log(error);
    }
}