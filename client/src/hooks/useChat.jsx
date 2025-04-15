import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';

export default function useChat() {
    const [messages, setMessages] = useState({0:[]});
    const [chats, setChats] = useState([]);
    const [room, setRoom] = useState(0);
    const socketRef = useRef(null);


    const goToChat = (roomId) => {
        console.log(roomId);
        setRoom(roomId);
        socketRef.current.emit("join_room", roomId);
        setMessages(prev => ({
            ...prev,
            [roomId]: prev[roomId] || []
        }));
    }

    const getMessageFromAdmin = (message) => {
        console.log(message);
        socketRef.current.emit('admin-message', JSON.stringify({message, room}));
        console.log('Надіслано через WebSocket:', message);
    }

    useEffect(() => {
        const socket = io('http://localhost:2800');
        socketRef.current = socket;
        
        socket.on('user-message', (data) => {
            console.log("Socketio", data);
            const parsedData = JSON.parse(data);
            const newchat = {
                roomId: parsedData.roomId,
                user: parsedData.message.username,
            };
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));

            setChats(prev => {
                if (prev.find(chat => chat.roomId === newchat.roomId)) return prev;
                return [...prev, newchat];
            });
        });
        
        return () => {
            socket.disconnect();
        };
    }, []);


    return {
        messages,
        setMessages,
        chats,
        setChats,
        room,
        setRoom,
        goToChat,
        getMessageFromAdmin,
    }
}
