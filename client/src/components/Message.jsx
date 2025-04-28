import React, { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';

import Input from './UI/Input';

export default function Message({
  message,

  onReplyMessage,

  // position, setPosition,
  contextMenu, setContextMenu,

  // edidingMessage, setEditingMessage,
  editMessage,

  deleteMessage,
}) {
  const adminStyles = [
    'w-[300px] p-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#002b28]',
    'truncate pt-[5px] pb-[5px] pl-[10px] pr-[10px] text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#003834] rounded-[10px]',
    'flex flex-col justify-evenly absolute z-10 w-[180px] h-[110px] p-[15px] rounded-[15px] bg-[#002724]',
    'flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#142b29]',
    'w-[90%] rounded-[5px] text-[15px] text-[#AAAAAA] font-[Ubuntu] font-[500] bg-[#003834]',
    'flex justify-center items-center w-[25px] h-[25px] rounded-[5px] font-[Ubuntu] font-[400] text-[#AAAAAA] hover:bg-[#003834]',
  ];
  const userStyles = [
    'w-[300px] p-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#222222]',
    'truncate pt-[5px] pb-[5px] pl-[10px] pr-[10px] text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#292929] rounded-[10px]',
    'flex flex-col justify-evenly absolute z-10 w-[180px] h-[110px] p-[15px] rounded-[15px] bg-[#202020]',
    'flex justify-start items-center text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] rounded-[10px] hover:bg-[#272727]',
    'w-[90%] rounded-[5px] text-[15px] text-[#AAAAAA] font-[Ubuntu] font-[500] bg-[#292929]',
    'flex justify-center items-center w-[25px] h-[25px] rounded-[5px] font-[Ubuntu] font-[400] text-[#AAAAAA] hover:bg-[#292929]',
  ];

  const [editedTextMsg, setEditedTextMsg] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // const [contextMenu, setContextMenu] = useState(0);
  const [edidingMessage, setEditingMessage] = useState(0);
  
  const contextMenuOpen = (ev) => {
    ev.preventDefault();
    setPosition({
      x: ev.clientX,
      y: ev.clientY,
    });
    setContextMenu(message.message_id);
  }
  const contextMenuClose = () => {
    setContextMenu(0);
  }
  const isContextMenu = message.message_id === contextMenu;

  const onEditMessage = () => {
    setContextMenu(0);
    setEditingMessage(message.message_id);
  }
  const editing = (ev) => {
    ev.preventDefault();
    editMessage(editedTextMsg, message);
    setEditingMessage(0);
  }
  const cancelEditing = () => {
    setEditingMessage(0);
  }
  const isEditing = message.message_id === edidingMessage;

  const deleting = () => {
    deleteMessage(message);
    setContextMenu(0);
  }

  // console.log(message.date);
  const date = new Date(message.date);
  return (
    <div className='mb-[10px]'>
      <div onContextMenu={contextMenuOpen} className={message.from_admin ? adminStyles[0] : userStyles[0]}>
        <header className='flex justify-between items-center'>
          <h2 className='text-[17px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>{message.username}</h2>
          <h2 onClick={() => onReplyMessage(message)} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70 duration-200 hover:opacity-100'>reply</h2>
        </header>
        {(message.replied_message.message_id === 0)
          ? <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
            {message.text}
          </p>
          : <div>
            <p className={message.from_admin ? adminStyles[1] : userStyles[1]}>
              <span className='font-[500] italic'>by {message.replied_message.username}</span> <br />
              {message.replied_message.text}
            </p>
            <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
              {message.text}
            </p>
          </div>
        }
        {(isContextMenu && message.from_admin) && (
          <div className={message.from_admin ? adminStyles[2] : userStyles[2]} style={{ left: `${position.x}px`, top: `${position.y - 100}px` }}>
            <p onClick={contextMenuClose} className={message.from_admin ? adminStyles[3] : userStyles[3]}>
              <X height={15} />
              Close
            </p>
            <p onClick={onEditMessage} className={message.from_admin ? adminStyles[3] : userStyles[3]}>
              <Pencil height={15} />
              Edit message
            </p>
            <p onClick={deleting} className={message.from_admin ? adminStyles[3] : userStyles[3]}>
              <Trash2 height={15} />
              Delete message
            </p>
          </div>
        )}
        {isEditing && (
          <form onSubmit={editing} className="flex justify-between items-center pt-[5px] h-[30px]">
            <Input
              placeholder={message.text}
              value={editedTextMsg}
              onChange={(ev) => setEditedTextMsg(ev.target.value)}
              className={message.from_admin ? adminStyles[4] : userStyles[4]}
            />
            <p onClick={cancelEditing} className={message.from_admin ? adminStyles[5] : userStyles[5]}>
              <X height={30} />
            </p>
          </form>
        )}
        <div className='flex justify-between items-center'>
          {(message.edited) 
            ? <p className='text-[12px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70'>edited</p>
            : <p></p>
          }
          <p className='text-[12px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70'>
            {date.getHours()}:{(date.getMinutes()) < 10 ? '0'+date.getMinutes() : date.getMinutes()} {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}