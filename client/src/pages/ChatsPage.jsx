import React from 'react';

import useChat from '../hooks/useChat';

import ChatsList from '../components/ChatsList';
import Chat from '../components/Chat';


export default function ChatsPage() {
    const {
        chats, setChats,
        messages, setMessages,
        room, setRoom,
        goToChat,

        getMessageFromAdmin,

        repliedMessage, setRepliedMessage,
        onReplyMessage,
        cancelReplyMessage,

        // contextMenu, setContextMenu,
        // position, setPosition,

        // edidingMessage, setEditingMessage,
        editMessage,

        deleteMessage,
    } = useChat();
    
    return (
        <div className='bg-[#1b1b1b]'>
            <header className='flex justify-center items-center h-[50px]'>
                <h1 className='text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
            </header>
            <main className='flex h-[calc(100vh-50px)]'>
                <aside id='Chats' className='w-[20%] h-full bg-[#222222] mr-[3px]'>
                    <ChatsList 
                        chats={chats}
                        room={room}  
                        goToChat={goToChat}
                    />
                </aside>
                <Chat 
                    messages={messages} 
                    room={room} 

                    getMessageFromAdmin={getMessageFromAdmin}
                    
                    repliedMessage={repliedMessage}
                    setRepliedMessage={setRepliedMessage}
                    onReplyMessage={onReplyMessage}
                    cancelReplyMessage={cancelReplyMessage}

                    // position={position}
                    // setPosition={setPosition}
                    // contextMenu={contextMenu} 
                    // setContextMenu={setContextMenu}

                    // edidingMessage={edidingMessage} 
                    // setEditingMessage={setEditingMessage}
                    editMessage={editMessage}

                    deleteMessage={deleteMessage}
                />
            </main>
        </div>
    )
}