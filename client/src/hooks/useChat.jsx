import React, {useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function useChat() {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({0:[]});
    const [room, setRoom] = useState(0);

    const [repliedMessage, setRepliedMessage] = useState({});

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

    const onReplyMessage = (message) => {
        setRepliedMessage(message)
    }

    const cancelReplyMessage = () => {
        setRepliedMessage("");
    }

    const editMessage = (editedText, editedMsg) => {
        console.log(editedText);
        console.log(editedMsg);
        let eMsg;
        setMessages(prev => {
            return {
                ...prev,
                [room]: prev[room].map(msg => {
                    let newMsg = { ...msg };
        
                    if (msg.message_id === editedMsg.message_id) {
                        newMsg.text = editedText;
                        eMsg = newMsg;
                    }
        
                    if (msg.replied_message?.message_id === editedMsg.message_id) {
                        newMsg.replied_message = {
                            ...msg.replied_message,
                            text: editedText,
                            edited: true,
                        };
                    }
                    return newMsg;
                })
            }
        })
        console.log(eMsg);

        socketRef.current.emit('edit-msg-from-client', JSON.stringify({message: eMsg, roomId: room}));
    };

    const deleteMessage = (message) => {
        console.log(message);
        const updatedMessages = messages[room].filter(msg => msg.message_id !== message.message_id);
        setMessages(prev => {
            return {
                ...prev,
                [room]: updatedMessages,
            }
        })
        socketRef.current.emit('del-msg-from-client', JSON.stringify({message, roomId: room}));
    }


    const closeChat = async (closedChat) => {
        // setChats(prevChats => prevChats.filter(chat => chat.roomId !== closedChat));
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.roomId === closedChat
                    ? { ...chat, isOpened: false } // створюємо новий об'єкт з оновленим opened
                    : chat // інші об'єкти залишаємо без змін
            )
        );
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
                      ? { ...msg, text: editedMsg.text, edited: true }
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
        onReplyMessage,
        cancelReplyMessage,

        editMessage,

        deleteMessage,

        closeChat,
    }
}