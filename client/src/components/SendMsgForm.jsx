import React from 'react';

import Input from './UI/Input';
import Button from './UI/Button';

export default function SendMsgForm() {
    const sendMessage = (ev) => {
        ev.preventDefault();
    }
    return (
        <form className='flex justify-center h-[40px] mb-[3px]' onSubmit={sendMessage}>
            <Input placeholder="Type..." styles="text-[20px] text-[#AAAAAA] font-[Ubuntu] font-[500] w-[90%] pl-[10px] bg-[#222222]"/>
            <Button styles="text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] w-[10%] bg-[#00e4d8] duration-300 hover:opacity-80">Send</Button>
        </form>
    )
}
