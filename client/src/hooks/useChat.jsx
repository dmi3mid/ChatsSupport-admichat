import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({0:[]});
    const [room, setRoom] = useState(0);

    const socketRef = useRef(null);


    const goToChat = (roomId) => {
        setRoom(roomId);
        socketRef.current.emit('join-room', JSON.stringify({roomId}));
        setMessages(prev => ({
            ...prev,
            [roomId]: prev[roomId] || []
        }));
    }

    const getMessageFromAdmin = (message) => {
        socketRef.current.emit('admin-message', JSON.stringify({message, room}));
    }


    const closeChat = async (closedChat) => {
        setMessages(prev => {
            const updated = { ...prev };
            delete updated[room];
            return;
        });
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.roomId === closedChat
                    ? { ...chat, isOpened: false }
                    : chat
            )
        );
        setRoom(0)
        const response = await axios.post('http://localhost:2800/closeChat', {isOpened: false}, {
            headers: {  
                roomId: closedChat,
            }
        });
    }



    useEffect(() => {
        const getUsers = async () => {
            const response = await axios.get('http://localhost:2800/getUsers');
            const usersData = response.data;
            console.log(usersData);
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
            })
        }
        const getMessages = async () => {
            const response = await axios.get('http://localhost:2800/getMessages');
            const messagesData = response.data;
            messagesData.forEach((message) => {
                setMessages(prev => ({
                    ...prev,
                    [message.room_id]: [...(prev[message.room_id] || []), message]
                }))
            })
        };
    
        getUsers();
        getMessages();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:2800');
        socketRef.current = socket;
        
        socket.on('start', (data) => {
            const parsedData = JSON.parse(data)
            const newchat = {
                roomId: parsedData._id,
                username: parsedData.username,
                isOpened: parsedData.isOpened,
            };

            setChats(prev => {
                if (prev.find(chat => chat.roomId === newchat.roomId)) return prev;
                return [...prev, newchat];
            });
        })

        socket.on('user-message', (data) => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));
        });

        socket.on('updated-admin-message', (data) => {
            const parsedData = JSON.parse(data);
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));
        });

        // socket.on('call', (data) => {
        //     const parsedData = JSON.parse(data);
        //     console.log(parsedData);
        //     setRoom(parsedData._id);
        //     const newchat = {
        //         roomId: parsedData._id,
        //         username: parsedData.username,
        //         isOpened: parsedData.isOpened,
        //     }
        //     console.log(newchat);
        //     setChats(prev => {
        //         if (prev.find(chat => chat.roomId === newchat.roomId)) return prev;
        //         return [...prev, newchat];
        //     });
            
        // })

        
        return () => {
            socket.disconnect();
        };
    }, []);


    return {
        chats, setChats,
        messages, setMessages,
        room, setRoom,

        goToChat,
        getMessageFromAdmin,
        closeChat,
    }
}