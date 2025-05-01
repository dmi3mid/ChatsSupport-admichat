import React, { useState } from 'react';

import ChatItem from './ChatItem';

export default function ChatsList({room, chats, goToChat, closeChat}) {
    const [contextMenu, setContextMenu] = useState(0);
    return (
        <div>
            {[...chats].filter(chat => chat.isOpened === true).map( (chat, idx) => (
                <ChatItem key={idx} 
                    id={chat.roomId} 
                    username={chat.username} 
                    goToChat={goToChat} 
                    room={room} 
                    closeChat={closeChat} 
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                />
            ))}           
        </div>
    )
}