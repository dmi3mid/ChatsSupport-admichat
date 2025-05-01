import React, { useState } from 'react';
import { X, Trash2, UserRoundX } from 'lucide-react';

export default function ChatItem({ 
    username, 
    id, 
    goToChat, 
    room, 
    closeChat, 
    contextMenu, 
    setContextMenu 
}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const contextMenuOpen = (ev) => {
        ev.preventDefault();
        setPosition({
            x: ev.clientX,
            y: ev.clientY,
        });
        setContextMenu(id); 
    };
    const contextMenuClose = () => {
        setContextMenu(0);
    };
    const isContextMenu = id === contextMenu;


    const close = () => {
        closeChat(id);
    }

    return (
        <>
            <div onClick={() => goToChat(id)} onContextMenu={(ev) => contextMenuOpen(ev, id)} className={`flex justify-center items-center w-[100%] h-[80px] ${room === id ? 'bg-[#272727]' : 'bg-[#222222]'} hover:bg-[#272727]`}>
                <h2 className='text-[25px] font-[Ubuntu] font-[450] text-[#a3afaf]'>{id}-{username}</h2>
            </div>
            {isContextMenu && (
                <div className='flex flex-col justify-evenly absolute z-10 w-[180px] h-[110px] p-[15px] rounded-[15px] bg-[#202020]' style={{ left: `${position.x}px`, top: `${position.y - 100}px` }}>
                    <p onClick={contextMenuClose} className='flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#272727]'>
                        <X height={15} />
                        Close
                    </p>
                    <p onClick={close} className='flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#272727]'>
                        <UserRoundX height={15} />
                        Close chat
                    </p>
                    <p className='flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#272727]'>
                        <Trash2 height={15} />
                        Delete chat
                    </p>
                </div>
            )}
        </>
    )
}