import React from 'react';

import useChat from '../hooks/useChat';

import ChatsList from '../components/ChatsList';
import Chat from '../components/Chat';


export default function ChatsPage() {
    const {
        messages, setMessages,
        chats, setChats,
        room, setRoom,
        goToChat,
        repliedMessage, setRepliedMessage,
        position, setPosition,
        menuVisibility,
        getMessageFromAdmin,
        getRepliedMessage,
        cancelReplyMessage,
        contextMenuOpen,
        contextMenuClose,
        getCtxMenuMsg
    } = useChat();

    return (
        <div className='bg-[#1b1b1b]'>
            <header className='flex justify-center items-center h-[50px]'>
                <h1 className='text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
            </header>
            <main className='flex h-[calc(100vh-50px)]'>
                <aside id='Chats' className='w-[20%] h-full bg-[#222222] mr-[3px]'>
                    <ChatsList 
                        room={room} 
                        chats={chats} 
                        goToChat={goToChat}
                    />
                </aside>
                <Chat 
                    messages={messages} 
                    room={room} 
                    setMessages={setMessages} 

                    getMessageFromAdmin={getMessageFromAdmin}
                    repliedMessage={repliedMessage}
                    setRepliedMessage={setRepliedMessage}
                    getRepliedMessage={getRepliedMessage}
                    cancelReplyMessage={cancelReplyMessage}
                    contextMenuOpen={contextMenuOpen}
                    contextMenuClose={contextMenuClose}
                    position={position}
                    menuVisibility={menuVisibility}
                    getCtxMenuMsg={getCtxMenuMsg}
                />
            </main>
        </div>
    )
}