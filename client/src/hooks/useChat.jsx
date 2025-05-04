import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({0:[]});
    const [room, setRoom] = useState(0);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef(null);

    // Helper to get adminId from localStorage
    const getAdminId = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr).id : null;
    };

    const goToChat = async (roomId) => {
        setRoom(roomId);
        setMessages(prev => ({
            ...prev,
            [roomId]: prev[roomId] || []
        }));
        // Join room as admin
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join-room', JSON.stringify({
                roomId,
                isAdmin: true
            }));
        }
    };

    const getMessageFromAdmin = (message) => {
        if (!socketRef.current || !isConnected) {
            setError('Not connected to server. Please try again.');
            return;
        }

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
        if (!socketRef.current || !isConnected) {
            setError('Not connected to server. Please try again.');
            return;
        }
        socketRef.current.emit('admin-closed-chat', JSON.stringify({
            roomId: closedChat,
            adminId: getAdminId()
        }));

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
                const adminId = getAdminId();
                usersData.forEach((user) => {
                    // Only add chats assigned to this admin
                    if (user.assignedAdminId && String(user.assignedAdminId) !== String(adminId)) return;
                    const newchat = {
                        roomId: user._id,
                        username: user.username,
                        isOpened: user.isOpened,
                    };
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
        const initializeSocket = async () => {
            try {
                // Parse user object from localStorage
                const userStr = localStorage.getItem('user');
                let adminId = null, email = null, username = null;
                if (userStr) {
                    try {
                        const userObj = JSON.parse(userStr);
                        adminId = userObj.id;
                        email = userObj.email;
                        username = userObj.username;
                    } catch (e) {
                        console.error('Failed to parse user from localStorage:', e, userStr);
                    }
                }
                console.log('Parsed user:', { adminId, email, username });

                if (!adminId || !email || !username) {
                    setError('Authentication required. Please log in again.');
                    return;
                }

                // Initialize socket connection
                const socket = io('http://localhost:2800', {
                    auth: {
                        adminId: adminId,
                        email: email,
                        username: username
                    },
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000
                });

                socketRef.current = socket;
                
                socket.on('connect', () => {
                    console.log('Socket connected successfully:', {
                        socketId: socket.id,
                        adminId,
                        email,
                        username
                    });
                    setIsConnected(true);
                    setError(null);
                });

                socket.on('connect_error', (error) => {
                    console.error('Socket connection error:', {
                        error: error.message,
                        adminId,
                        email,
                        username
                    });
                    setError('Failed to connect to server. Please try again.');
                    setIsConnected(false);
                });

                socket.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

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
                    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    const { message, roomId } = parsedData;
                    setMessages(prev => {
                        const msgs = prev[roomId] || [];
                        if (msgs.some(m => m.message_id && m.message_id === message.message_id && m.text === message.text)) {
                            return prev;
                        }
                        return {
                            ...prev,
                            [roomId]: [...msgs, message]
                        };
                    });
                });

                socket.on('admin-message', (data) => {
                    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    setMessages(prev => {
                        const msgs = prev[parsedData.room_id] || [];
                        if (msgs.some(m => m.message_id && m.message_id === parsedData.message_id && m.text === parsedData.text)) {
                            return prev;
                        }
                        return {
                            ...prev,
                            [parsedData.room_id]: [...msgs, parsedData]
                        };
                    });
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
                    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    if (parsedData.status === 'sent') {
                        setMessages(prev => {
                            const msgs = prev[parsedData.roomId] || [];
                            if (msgs.some(m => m.message_id && m.message_id === parsedData.message.message_id && m.text === parsedData.message.text)) {
                                return prev;
                            }
                            return {
                                ...prev,
                                [parsedData.roomId]: [...msgs, parsedData.message]
                            };
                        });
                    }
                });
                
            } catch (error) {
                console.error('Error initializing socket:', error);
                setError('Failed to initialize connection. Please try again.');
                setIsConnected(false);
            }
        };

        initializeSocket();

        return () => {
            console.log('Cleaning up socket connection');
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setIsConnected(false);
        };
    }, []);

    const sendUserMessage = (message) => {
        if (!socketRef.current || !isConnected) {
            setError('Not connected to server. Please try again.');
            return;
        }

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
        isConnected,
        goToChat,
        getMessageFromAdmin,
        closeChat,
        sendUserMessage,
    }
}