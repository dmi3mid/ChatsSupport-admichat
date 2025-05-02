module.exports = function onJoinRoom(socket, connections, data) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Join room request:', parsedData);
        
        const { roomId, isAdmin } = parsedData;
        
        // Store connection with appropriate prefix
        const connectionKey = isAdmin ? `admin-${roomId}` : `user-${roomId}`;
        connections.set(connectionKey, socket.id);
        
        // Join socket.io room
        socket.join(roomId);
        
        console.log(`Socket ${socket.id} joined room ${roomId} as ${isAdmin ? 'admin' : 'user'}`);
        console.log('Current connections:', connections);
        
        // Notify client of successful join
        socket.emit('room-joined', {
            roomId,
            isAdmin,
            status: 'success'
        });
    } catch (error) {
        console.error('Join room error:', error);
        socket.emit('room-join-error', {
            error: error.message || 'Failed to join room'
        });
    }
}