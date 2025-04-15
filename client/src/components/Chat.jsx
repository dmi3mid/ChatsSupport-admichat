import React from 'react';

import SendMsgForm from './SendMsgForm';
import MsgFromUser from './Messages/MsgFromUser';
import MsgFromAdmin from './Messages/MsgFromAdmin';

export default function Chat({messages, room, setMessages, getMessageFromAdmin}) {
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
                            msg.fromAdmin
                            ? <MsgFromAdmin key={idx} message={msg}/>
                            : <MsgFromUser key={idx} message={msg}/>
                        ))}
                    </div>
                    <SendMsgForm messages={messages[room]} room={room} setMessages={setMessages} getMessageFromAdmin={getMessageFromAdmin}/>
               </div>
                }
        </> 
    )
}
