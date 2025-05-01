module.exports = async function (io, connections, data, users) {
    try {
        const parsedData = JSON.parse(data);
        io.to(connections.get(parsedData._id)).emit('call', data);
        const foundUser = await users.findOne({_id: parsedData._id});
        if (!foundUser.isOpened) await users.updateOne({_id: parsedData._id}, {$set: {isOpened: true}});
    } catch (error) {
        console.log(error);
    }
}