import React from 'react';

import isEmptyObj from '../../utils/isEmptyObj';

export default function MsgFromAdmin({
  message, 
  getRepliedMessage
}) {
  const sendRepliedMessage = () => {
    getRepliedMessage(message)
  }
    return (
      <div className='w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#002b28]'>
        <header className='flex justify-between items-center'>
          <h2 className='text-[17px] font-[Ubuntu] font-[400] text-[#AAAAAA]'>{message.username}</h2>
          <h2 onClick={sendRepliedMessage} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70 duration-200 hover:opacity-100'>reply</h2>
        </header>
        {(isEmptyObj(message.repliedMessage))
          ? <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
             {message.text}
            </p> 
          : <div>
              <p className='truncate pt-[5px] pb-[5px] pl-[10px] pr-[10px] text-[15px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#003834] rounded-[10px]'>
                <span className='font-[500] italic'>by {message.repliedMessage.username}</span> <br />
                {message.repliedMessage.text}
              </p>
              <p className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA]'>
                {message.text}
              </p>
            </div>
        }
      </div>
    )
}