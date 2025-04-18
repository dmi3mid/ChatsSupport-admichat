import React, { useState } from 'react';

import Input from './UI/Input';
import Button from './UI/Button';

import isEmptyObj from '../utils/isEmptyObj';

export default function SendMsgForm({
    getMessageFromAdmin,
    repliedMessage,
    setRepliedMessage,
    cancelReplyMessage
}) {
    const [textMessage, setTextMessage] = useState('');
    const message = {
        from_admin: true,
        username: "admi3chatbot",
        date: Date.now(),
        text: textMessage,
        replied_message : repliedMessage,
    };
    const sendMessage = (ev) => {
        ev.preventDefault();
        if (textMessage.trim() === "") return;
        setRepliedMessage({});
        getMessageFromAdmin(message);
        setTextMessage('');
    }

    return (
        <>
            {(!isEmptyObj(repliedMessage))
                ? <div className='flex flex-col w-full bg-[#222222]'>
                    <div className='flex justify-between pt-[10px] pb-[10px] pl-[20px] pr-[20px]'>
                        <h2 className='text-[15px] font-[Ubuntu] font-[500] text-[#AAAAAA]'>Reply on {repliedMessage.username}'s message</h2>
                        <h2 onClick={cancelReplyMessage} className='text-[15px] font-[Ubuntu] font-[300] text-[#AAAAAA] opacity-70 duration-200 hover:opacity-100'>cancle</h2>
                    </div>
                    <p className='truncate pb-[10px] pl-[20px] pr-[20px] text-[13px] font-[Ubuntu] font-[350] text-[#AAAAAA]'>{repliedMessage.text}</p>
                </div>
                : <></>
            }
            <form className='flex justify-center h-[40px]' onSubmit={sendMessage}>
                <Input
                    placeholder="Type..."
                    value={textMessage}
                    onChange={ev => setTextMessage(ev.target.value)}
                    styles="text-[20px] text-[#AAAAAA] font-[Ubuntu] font-[500] w-[90%] pl-[10px] bg-[#222222]"
                />
                <Button styles="text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] w-[10%] bg-[#00e4d8] duration-300 hover:opacity-80">Send</Button>
            </form>
        </>
    )
}