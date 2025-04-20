import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const [messages, setMessages] = useState({0:[]});
    const [chats, setChats] = useState([]);
    const [room, setRoom] = useState(0);
    const [repliedMessage, setRepliedMessage] = useState({});
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const socketRef = useRef(null);
    const messagesRef = useRef({0:[]});
    const menuVisibilityRef = useRef(false);


    const goToChat = (roomId) => {
        setRoom(roomId);
        socketRef.current.emit('join_room', roomId);
        // messagesRef.current = {
        //     ...messagesRef.current,
        //     [roomId]: messagesRef.current[roomId] || []
        // };
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

    const contextMenuOpen = (ev) => {
        ev.preventDefault();
        menuVisibilityRef.current = false;
        menuVisibilityRef.current = true;
        setPosition({
            x: ev.clientX,
            y: ev.clientY, 
        });
    }
    const getCtxMenuMsg = (message) => {
        console.log(message);
    }
    const contextMenuClose = () => {
        menuVisibilityRef.current = false;
        setPosition({
            x: 0,
            y: 0, 
        });
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
                // messagesRef.current = {
                //     ...messagesRef.current,
                //     [message.room_id]: [
                //         ...(messagesRef.current[message.room_id] || []),
                //         message
                //     ]
                // };
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
            // messagesRef.current = {
            //     ...messagesRef.current,
            //     [parsedData.message.roomId]: [
            //         ...(messagesRef.current[parsedData.roomId] || []),
            //         parsedData.message
            //     ]
            // };
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
            // messagesRef.current = {
            //     ...messagesRef.current,
            //     [parsedData.message.roomId]: [
            //         ...(messagesRef.current[parsedData.roomId] || []),
            //         parsedData.message
            //     ]
            // };
            setMessages(prev => ({
                ...prev,
                [parsedData.roomId]: [...(prev[parsedData.roomId] || []), parsedData.message]
            }));
        });
        
        
        return () => {
            socket.disconnect();
        };
    }, [messagesRef]);

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
        messages, setMessages,
        chats, setChats,
        room, setRoom,
        repliedMessage, setRepliedMessage,
        menuVisibility: menuVisibilityRef.current,
        position, setPosition,
        goToChat,
        getMessageFromAdmin,
        getRepliedMessage,
        cancelReplyMessage,
        contextMenuOpen,
        contextMenuClose,
        getCtxMenuMsg,

        socket: socketRef.current,
    }
}