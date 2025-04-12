import React from 'react'

export default function Chat({username, id}) {
    return (
        <div className='flex justify-center items-center w-[100%] h-[80px] bg-[#222222] hover:bg-[#272727]'>
            <h2 className='text-[25px] font-[Ubuntu] font-[450] text-[#a3afaf]'>{id}-{username}</h2>
        </div>
    )
}
