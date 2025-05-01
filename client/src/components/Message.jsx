import React, { useState } from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';

import Input from './UI/Input';

export default function Message({ message }) {
  const adminStyles = [
    'w-[300px] p-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#002b28]',
  ];
  const userStyles = [
    'w-[300px] p-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#222222]',
  ];

  const date = new Date(message.date);
  return (
    <div className='mb-[10px]'>
      <div className={message.from_admin ? adminStyles[0] : userStyles[0]}>
        <header className='flex justify-between items-center'>
          <h2 className='text-[17px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>{message.username}</h2>
        </header>
        <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
          {message.text}
        </p>
        <div className='flex justify-between items-center'>
          <p className='text-[12px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70'>
            {date.getHours()}:{(date.getMinutes()) < 10 ? '0'+date.getMinutes() : date.getMinutes()} {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}