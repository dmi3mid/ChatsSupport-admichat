import React from 'react';

import ChatItem from './ChatItem';

export default function ChatsList({room, chats, goToChat}) {
    return (
        <div>
            {chats.map( (chat, idx) => (
                <ChatItem key={idx} id={chat.roomId} username={chat.user} goToChat={goToChat} room={room}/>
            ))}           
        </div>
    )
}