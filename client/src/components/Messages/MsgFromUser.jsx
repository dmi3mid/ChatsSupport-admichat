import React from 'react';

export default function MsgFromUser({message, ...props}) {
  return (
    // <p {...props} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] max-w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#222222]'>
    //   <span className='font-[450]'>{message.username}:</span><br/> {message.text}
    // </p>
          <div className='w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#222222]'>
          <header className='flex justify-between items-center'>
            <h2 className='text-[17px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>{message.username}</h2>
            <h2 className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70 duration-200 hover:opacity-100'>reply</h2>
          </header>
          <p {...props} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
            {message.text}
          </p>
        </div>
  )
}