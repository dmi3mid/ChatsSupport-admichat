import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({0:[]});
    const [room, setRoom] = useState(0);

    const [repliedMessage, setRepliedMessage] = useState({});

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState(0);

    const [edidingMessage, setEditingMessage] = useState(0);

    const socketRef = useRef(null);


    const goToChat = (roomId) => {
        setRoom(roomId);
        socketRef.current.emit('join_room', roomId);
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

    const editMessage = (message) => {
        console.log(message);
    }

    useEffect(() => {
        const getUsers = async () => {
            const response = await axios.get('http://localhost:2800/getUsers');
            const usersData = response.data;
            // console.log(usersData);
            usersData.forEach((user) => {
                const newchat = {
                    roomId: user._id,
                    username: user.username,
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
            // console.log(messagesData);
            messagesData.forEach((message) => {
                setMessages(prev => ({
                    ...prev,
                    [message.room_id]: [...(prev[message.room_id] || []), message]
                }));
            })
        }
    
        getUsers();
        getMessages();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:2800');
        socketRef.current = socket;
        // console.log(messagesRef);
        // console.log(messages);
        
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

        socket.on('updated-admin-message', (data) => {
            const parsedData = JSON.parse(data);
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));
        });
        
        
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('edit-msg-from-bot',  async (data) => {
            const parsedData = await JSON.parse(data);
            const roomId = parsedData.roomId;
            const editedMsg = parsedData.editedMsg;
            setMessages(prev => {
                return {
                  ...prev,
                  [roomId]: prev[roomId].map(msg =>
                    msg.message_id === editedMsg.messageId
                      ? { ...msg, text: editedMsg.text }
                      : msg
                  )
                };
              });
        })
    }, []);

    return {
        chats, setChats,
        messages, setMessages,
        room, setRoom,
        goToChat,

        getMessageFromAdmin,

        repliedMessage, setRepliedMessage,
        getRepliedMessage,
        cancelReplyMessage,

        contextMenu, setContextMenu,
        position, setPosition,

        edidingMessage, setEditingMessage,
        editMessage,
    }
}