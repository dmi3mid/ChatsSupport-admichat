module.exports = async function onStart(io, socket, connections, data, users) {
    try {
        const parsedData = JSON.parse(data);
        connections.set(`user-${parsedData._id}`, socket.id);
        io.emit('start', data);
        if (!await users.findOne({ _id: parsedData._id })) users.insertOne(parsedData);
        else console.log("Users already in database");   
    } catch (error) {
        console.log(error);
    }
}