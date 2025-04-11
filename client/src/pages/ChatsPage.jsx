import React, { useState, useEffect } from 'react'

import Chats from '../components/Chats/Chats';

export default function ChatsPage() {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:2800');
      
        socket.onopen = () => console.log('WebSocket підключено');
        socket.onmessage = (event) => {
          console.log('📨 Отримано:', event.data);
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        };
      
        socket.onerror = (e) => console.error('Socket error:', e);
      
        return () => socket.close();
      }, []);
    return (
        <div className='bg-[#1b1b1b]'>
            <header className='flex justify-center items-center h-[50px]'>
                <h1 className='text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
            </header>
            <main className='flex'>
                <aside className='w-[20%] h-screen bg-[#222222]'>
                </aside>
                <div className='w-[80%] h-screen'>
                    <p>
                        {messages.map((msg, idx) => (
                            <li key={idx} className='text-amber-200'><strong>{msg.from}:</strong> {msg.text}</li>
                        ))}
                    </p>
                </div>
            </main>
        </div>
    )
}
