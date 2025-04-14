import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';

import Chat from '../components/Chat';
import SendMsgForm from '../components/SendMsgForm';
import MsgFromUser from '../components/Messages/MsgFromUser';
import MsgFromAdmin from '../components/Messages/MsgFromAdmin';

export default function ChatsPage() {
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


    const getMessageFromAdmin = (message) => {
        console.log(message);
        socketRef.current.emit('admin-message', JSON.stringify({message, room}));
        console.log('Надіслано через WebSocket:', message);
    }


    return (
        <div className='bg-[#1b1b1b]'>
            <header className='flex justify-center items-center h-[50px]'>
                <h1 className='text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
            </header>
            <main className='flex h-[calc(100vh-50px)]'>
                <aside id='Chats' className='w-[20%] h-full bg-[#222222] mr-[3px]'>
                    {chats.map( (chat, idx) => (
                        <Chat key={idx} id={chat.roomId} username={chat.user} goToChat={goToChat}/>
                    ))}
                </aside>
                {(!messages[room] || messages[room].length === 0)
                    ? <div className='w-[80%] h-full flex justify-center items-center'>
                        <h2 className='text-[25px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>Choose chat</h2>
                    </div>
                    : <div id='Chat' className='w-[80%] h-full flex flex-col'>
                        <div className='flex flex-col h-full overflow-y-auto'>
                            {messages[room].map((msg, idx) => (
                                msg.fromAdmin
                                ? <MsgFromAdmin key={idx} message={msg}/>
                                : <MsgFromUser key={idx} message={msg}/>
                            ))}
                        </div>
                        <SendMsgForm messages={messages[room]} room={room} setMessages={setMessages} getMessageFromAdmin={getMessageFromAdmin}/>
                    </div>
                } 
            </main>
        </div>
    )
}
