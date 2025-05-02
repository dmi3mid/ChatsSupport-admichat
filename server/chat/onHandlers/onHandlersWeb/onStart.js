module.exports = async function onStart(io, connections, data, users) {
    try {
        const parsedData = JSON.parse(data);
        const user = {
            _id: parsedData._id,
            username: parsedData.username,
            isOpened: parsedData.isOpened,
        }
        const jsonData = JSON.stringify(user);
        io.emit('start', jsonData);
        if (!await users.findOne({ _id: user._id })) users.insertOne(user);
        else console.log("Users already in database");
    } catch (error) {
        console.log(error);
    }
}
