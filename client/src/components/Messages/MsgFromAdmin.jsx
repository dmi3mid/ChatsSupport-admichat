import React from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';

export default function MsgFromAdmin({
  message,

  getRepliedMessage,

  position, setPosition,
  contextMenu, setContextMenu,
}) {
  const onReplyToMessage = () => {
    getRepliedMessage(message);
  }
  const contextMenuOpen = (ev) => {
    ev.preventDefault();
    setContextMenu(0);
    setContextMenu(message.message_id);
    setPosition({
        x: ev.clientX,
        y: ev.clientY, 
    });
  }
  const contextMenuClose = () => {
    setContextMenu(0);
  }
const isContextMenu = message.message_id === contextMenu;
  return (
    <div onContextMenu={contextMenuOpen} className='w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#002b28]'>
      <header className='flex justify-between items-center'>
        <h2 className='text-[17px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>{message.username}</h2>
        <h2 onClick={onReplyToMessage} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70 duration-200 hover:opacity-100'>reply</h2>
      </header>
      {(message.replied_message.message_id === 0)
        ? <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
          {message.text}
        </p>
        : <div>
          <p className='truncate pt-[5px] pb-[5px] pl-[10px] pr-[10px] text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#003834] rounded-[10px]'>
            <span className='font-[500] italic'>by {message.replied_message.username}</span> <br />
            {message.replied_message.text}
          </p>
          <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
            {message.text}
          </p>
        </div>
      }
      {(isContextMenu)
        ? <div className={`flex flex-col justify-evenly absolute z-10 w-[180px] h-[110px] p-[15px] rounded-[15px] bg-[#002724]`} style={{ left: `${position.x}px`, top: `${position.y - 100}px` }}>
          <p onClick={contextMenuClose} className='flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#142b29]'>
            <X height={15} />
            Close
          </p>
          <p className='flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#142b29]'>
            <Pencil height={15} />
            Edit message
          </p>
          <p className='flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#142b29]'>
            <Trash2 height={15} />
            Delete message
          </p>
        </div>
        : <></>
      }
    </div>
  )
}