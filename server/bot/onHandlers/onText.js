module.exports = async function onText(msg, io, connections, messages) {
    try {
        const message = {
            room_id: msg.from.id,
            from_admin: false,
            message_id: msg.message_id,
            username: msg.from.username || msg.from.first_name || 'Unknown user',
            date: Date.now(),
            text: msg.text,
            is_bot_msg: true,
        };
        
        const roomId = msg.from.id;
        const jsonMessage = JSON.stringify({message, roomId});
        await io.to(connections.get(roomId)).emit('user-message', jsonMessage); 
        await messages.insertOne(message);
    } catch (error) {
        console.log(error);
    }
}