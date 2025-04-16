import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';

export default function useChat() {
    const [messages, setMessages] = useState({0:[]});
    const [chats, setChats] = useState([]);
    const [room, setRoom] = useState(0);
    const [repliedMessage, setRepliedMessage] = useState({});
    const socketRef = useRef(null);


    const goToChat = (roomId) => {
        setRoom(roomId);
        socketRef.current.emit("join_room", roomId);
        setMessages(prev => ({
            ...prev,
            [roomId]: prev[roomId] || []
        }));
    }

    const getMessageFromAdmin = (message) => {
        socketRef.current.emit('admin-message', JSON.stringify({message, room}));
    }

    const getRepliedMessage = (message) => {
        setRepliedMessage(message)
    }

    const cancelReplyMessage = () => {
        setRepliedMessage("");
    }

    useEffect(() => {
        const socket = io('http://localhost:2800');
        socketRef.current = socket;
        
        socket.on('user-message', (data) => {
            const parsedData = JSON.parse(data);
            const newchat = {
                roomId: parsedData.roomId,
                username: parsedData.message.username,
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

        socket.on("updated-admin-message", (data) => {
            const parsedData = JSON.parse(data);
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));
        })
        
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
        repliedMessage,
        setRepliedMessage,
        goToChat,
        getMessageFromAdmin,
        getRepliedMessage,
        cancelReplyMessage,
    }
}