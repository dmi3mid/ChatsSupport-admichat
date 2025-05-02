import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({0:[]});
    const [room, setRoom] = useState(0);
    const [error, setError] = useState(null);

    const socketRef = useRef(null);

    const goToChat = (roomId) => {
        setRoom(roomId);
        // Join room as admin
        socketRef.current.emit('join-room', JSON.stringify({
            roomId,
            isAdmin: true
        }));
        setMessages(prev => ({
            ...prev,
            [roomId]: prev[roomId] || []
        }));
    }

    const getMessageFromAdmin = (message) => {
        setError(null);
        if (!room) {
            setError('No chat selected');
            return;
        }
        
        // Check if this is a Telegram chat (room ID is a number)
        const isTelegramChat = typeof room === 'number' || !isNaN(Number(room));
        
        const messageData = {
            message,
            room,
            isWebChat: !isTelegramChat // Set isWebChat to false for Telegram chats
        };
        
        console.log('Sending admin message:', messageData);
        socketRef.current.emit('admin-message', JSON.stringify(messageData));
    };

    const closeChat = async (closedChat) => {
        setMessages(prev => {
            const updated = { ...prev };
            delete updated[room];
            return updated;
        });
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.roomId === closedChat
                    ? { ...chat, isOpened: false }
                    : chat
            )
        );
        setRoom(0);
        
        try {
            await axios.post('http://localhost:2800/closeChat', 
                { isOpened: false }, 
                { headers: { roomId: closedChat } }
            );
        } catch (error) {
            console.error('Error closing chat:', error);
            setError('Failed to close chat');
        }
    }

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get('http://localhost:2800/getUsers');
                const usersData = response.data;
                usersData.forEach((user) => {
                    const newchat = {
                        roomId: user._id,
                        username: user.username,
                        isOpened: user.isOpened,
                    }
                    setChats(prev => {
                        if (prev.find(chat => chat.roomId === newchat.roomId)) return prev;
                        return [...prev, newchat];
                    });
                });
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load chats');
            }
        };

        const getMessages = async () => {
            try {
                const response = await axios.get('http://localhost:2800/getMessages');
                const messagesData = response.data;
                messagesData.forEach((message) => {
                    setMessages(prev => ({
                        ...prev,
                        [message.room_id]: [...(prev[message.room_id] || []), message]
                    }));
                });
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError('Failed to load messages');
            }
        };
    
        getUsers();
        getMessages();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:2800');
        socketRef.current = socket;
        
        socket.on('room-joined', (data) => {
            console.log('Joined room:', data);
        });

        socket.on('room-join-error', (data) => {
            console.error('Room join error:', data);
            setError(data.error);
        });

        socket.on('start', (data) => {
            const parsedData = JSON.parse(data);
            const newchat = {
                roomId: parsedData._id,
                username: parsedData.username,
                isOpened: parsedData.isOpened,
            };

            setChats(prev => {
                if (prev.find(chat => chat.roomId === newchat.roomId)) return prev;
                return [...prev, newchat];
            });
        });

        socket.on('user-message', (data) => {
            const parsedData = JSON.parse(data);
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));
        });

        socket.on('admin-message', (data) => {
            const parsedData = JSON.parse(data);
            setMessages(prev => ({
                ...prev,
                [parsedData.room_id]: [...(prev[parsedData.room_id] || []), parsedData]
            }));
        });

        socket.on('admin-message-error', (data) => {
            console.error('Admin message error:', data);
            setError(data.error);
        });

        socket.on('user-message-error', (data) => {
            console.error('User message error:', data);
            setError(data.error);
        });

        socket.on('updated-admin-message', (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.status === 'sent') {
                setMessages(prev => ({
                    ...prev,
                    [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
                }));
            }
        });
        
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendUserMessage = (message) => {
        setError(null);
        if (!room) {
            setError('No chat selected');
            return;
        }

        const messageData = {
            ...message,
            room_id: room,
            isWebChat: true // Always true for web user messages
        };

        console.log('Sending user message:', messageData);
        socketRef.current.emit('user-message', JSON.stringify(messageData));
    };

    return {
        chats,
        messages,
        room,
        error,
        goToChat,
        getMessageFromAdmin,
        closeChat,
        sendUserMessage,
    }
}