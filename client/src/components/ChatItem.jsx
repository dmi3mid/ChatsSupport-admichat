import React from 'react';

export default function ChatItem({username, id, goToChat, room}) {
    return (
        <div onClick={() => goToChat(id)} className={`flex justify-center items-center w-[100%] h-[80px] ${room === id ? 'bg-[#272727]' : 'bg-[#222222]'} hover:bg-[#272727]`}>
            <h2 className='text-[25px] font-[Ubuntu] font-[450] text-[#a3afaf]'>{id}-{username}</h2>
        </div>
    )
}