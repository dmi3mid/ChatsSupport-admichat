import React from 'react';

import isEmptyObj from '../utils/isEmptyObj';

import SendMsgForm from './SendMsgForm';
import MsgFromUser from './Messages/MsgFromUser';
import MsgFromAdmin from './Messages/MsgFromAdmin';


export default function Chat({
    messages, 
    room, 
    setMessages, 
    getMessageFromAdmin, 
    repliedMessage,
    setRepliedMessage,
    getRepliedMessage,
    cancelReplyMessage
}) {
    return (
        <>
            {(!messages[room] || messages[room].length === 0)
                ? <div className='w-[80%] h-full flex justify-center items-center'>
                    <h2 className='text-[20px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#222222] pr-[50px] pl-[50px] pt-[2px] pb-[2px] rounded-[20px]'>
                        Choose chat, to start conversation
                    </h2>
                </div>
                : <div id='Chat' className='w-[80%] h-full flex flex-col'>
                    <div className='flex flex-col h-full overflow-y-auto'>
                        {messages[room].map((msg, idx) => (
                            msg.from_admin
                            ? <MsgFromAdmin key={idx} message={msg} getRepliedMessage={getRepliedMessage}/>
                            : <MsgFromUser key={idx} message={msg} getRepliedMessage={getRepliedMessage}/>
                        ))}
                    </div>
                    <div className='mb-[3px]'>
                        <SendMsgForm 
                            messages={messages[room]} 
                            room={room} 
                            setMessages={setMessages} 
                            getMessageFromAdmin={getMessageFromAdmin} 
                            repliedMessage={repliedMessage} 
                            setRepliedMessage={setRepliedMessage}
                            cancelReplyMessage={cancelReplyMessage}
                        />
                    </div>
               </div>
                }
        </> 
    )
}