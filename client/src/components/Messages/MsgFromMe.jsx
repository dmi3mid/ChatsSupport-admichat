import React from 'react'

export default function MsgFromMe({message, ...props}) {
    return (
      <p {...props} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] max-w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] break-words inline-block bg-[#002b28]'>
        <span className='font-[450]'>{message.username}:</span><br/> {message.text}
      </p>
    )
}
