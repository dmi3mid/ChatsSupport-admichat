import React, { useState, useEffect } from 'react'

import Chat from '../components/Chats/Chat';
import SendMsgForm from '../components/SendMsgForm';
import MsgToMe from '../components/Messages/MsgToMe';

export default function ChatsPage() {
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:2800');
      
        socket.onopen = () => console.log('WebSocket підключено');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log(data);
            const message = data;
            const newchat = {
                id: data.fromId,
                user: data.from,
            }
            setMessages(prev => [...prev, message]);
            setChats(prev => {
                if (prev.find(chat => chat.id === newchat.id)) return prev;
                return [...prev, newchat];
              });
        };
        socket.onerror = (e) => console.error('Socket error:', e);
      
        return () => socket.close();
      }, []);
    return (
        <div className='bg-[#1b1b1b]'>
            <header className='flex justify-center items-center h-[50px]'>
                <h1 className='text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
            </header>
            <main className='flex h-[calc(100vh-50px)]'>
                <aside id='Chats' className='w-[20%] h-full bg-[#222222] mr-[3px]'>
                    {chats.map( (chat, idx) => (
                        // <p key={idx} className='text-emerald-400'>{chat.user}</p>
                        <Chat key={idx} id={chat.id} username={chat.user}/>
                    ))}
                </aside>
                <div id='Chat' className='w-[80%] h-full flex flex-col'>
                    <div className='flex flex-col h-full overflow-y-auto'>
                        {messages.map((msg, idx) => (
                            <MsgToMe key={idx} username={msg.from} text={msg.text}/>
                        ))}
                    </div>
                    <SendMsgForm />
                </div>
            </main>
        </div>
    )
}
