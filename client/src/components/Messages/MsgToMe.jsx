import React from 'react'

export default function MsgToMe({username, text, ...props}) {
  return (
    <p {...props} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] max-w-[300px] p-[10px] mb-[10px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] bg-[#222222] break-words inline-block'>
      <span className='font-[450]'>{username}:</span><br/> {text}
    </p>
  )
}
