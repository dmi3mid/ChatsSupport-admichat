module.exports = async function onText(msg, io, connections, messages) {
    try {
        const message = {
            room_id: msg.from.id,
            from_admin: false,
            message_id: msg.message_id,
            username: msg.from.username || msg.from.first_name || 'Unknown user',
            date: Date.now(),
            text: msg.text,
            edited: false,
            replied_message: {
                from_admin: msg?.reply_to_message?.from?.is_bot || false,
                message_id: msg?.reply_to_message?.message_id || 0,
                username: msg?.reply_to_message?.from.username || msg?.reply_to_message?.from?.first_name || "Unknown user",
                date: msg?.reply_to_message?.date || 0,
                text: msg?.reply_to_message?.text || "",
            },
        };
        
        const roomId = msg.from.id;
        const jsonMessage = JSON.stringify({message, roomId});
        io.to(connections.get(roomId)).emit('user-message', jsonMessage); 
        await messages.insertOne(message);
    } catch (error) {
        console.log(error);
    }
}