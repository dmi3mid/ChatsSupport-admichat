import React, { useState } from 'react';

import Input from './UI/Input';
import Button from './UI/Button';

import isEmptyObj from '../utils/isEmptyObj';

export default function SendMsgForm({ getMessageFromAdmin }) {
    const [textMessage, setTextMessage] = useState('');
    const message = {
        from_admin: true,
        username: "admi3chatbot",
        date: Date.now(),
        text: textMessage,
    };
    const sendMessage = (ev) => {
        ev.preventDefault();
        if (textMessage.trim() === "") return;
        getMessageFromAdmin(message);
        setTextMessage('');
    }

    return (
        <form className='flex justify-center h-[40px]' onSubmit={sendMessage}>
            <Input
                placeholder="Type..."
                value={textMessage}
                onChange={ev => setTextMessage(ev.target.value)}
                styles="text-[20px] text-[#AAAAAA] font-[Ubuntu] font-[500] w-[90%] pl-[10px] bg-[#222222]"
            />
            <Button styles="text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] w-[10%] bg-[#00e4d8] duration-300 hover:opacity-80">Send</Button>
        </form>
    )
}