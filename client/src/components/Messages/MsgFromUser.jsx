import React from 'react';

export default function MsgFromUser({
  message, 
  getRepliedMessage
}) {
  const sendRepliedMessage = () => {
    console.log(message);
    getRepliedMessage(message)
  }

  return (
    <div className='w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#222222]'>
    <header className='flex justify-between items-center'>
      <h2 className='text-[17px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>{message.username}</h2>
      <h2 onClick={sendRepliedMessage} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70 duration-200 hover:opacity-100'>reply</h2>
    </header>
    {(message.replied_message.message_id === 0)
      ? <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
         {message.text}
        </p> 
      : <div>
          <p className='truncate pt-[5px] pb-[5px] pl-[10px] pr-[10px] text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#292929] rounded-[10px]'>
            <span className='font-[500] italic'>by {message.replied_message.username}</span> <br />
            {message.replied_message.text}
          </p>
          <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
            {message.text}
          </p>
        </div>
    }
  </div>
  )
}