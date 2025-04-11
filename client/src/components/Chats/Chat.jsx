import React from 'react'

export default function Chat({username}) {
    return (
        <div className='flex flex-col justify-center w-[100%] h-[80px] bg-[#222222] hover:bg-[#272727]'>
            <h2 className='text-[30px] font-[Ubuntu] font-[450] text-[#a3afaf] ml-[15px]'>{username}</h2>
            <p className='text-[15px] font-[Ubuntu] font-[450] text-[#a3afaf] ml-[15px]'>Last message</p>
        </div>
    )
}
