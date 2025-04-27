module.exports = async function onEditedMessage(msg, io, connections, messages) {
    try {
        const roomId = msg.from.id;
        const messageId = msg.message_id;
        const editedMsg = {
            text: msg.text,
            messageId: msg.message_id
        }
        const jsonEditedMsg = JSON.stringify({editedMsg, roomId});
        io.to(connections.get(roomId)).emit('edit-msg-from-bot', jsonEditedMsg);   
        const filters = {
            room_id: roomId,
            message_id: messageId
        }
        const updatedMessage = {
            $set: {
                text: editedMsg.text,
                edited: true
            }
        }
        await messages.updateOne(filters, updatedMessage);
    } catch (error) {
        console.log(error);
    }
}