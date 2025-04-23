import React from 'react';

import SendMsgForm from './SendMsgForm';
import Message from './Message';


export default function Chat({
    messages,
    room,

    getMessageFromAdmin,

    repliedMessage, setRepliedMessage,
    getRepliedMessage,
    cancelReplyMessage,

    position, setPosition,
    contextMenu, setContextMenu,

    edidingMessage, setEditingMessage,
    editMessage,

    deleteMessage,
}) {
    return (
        <>
            {!room ? (
                <div className='w-[80%] h-full flex justify-center items-center'>
                    <h2 className='text-[20px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#222222] pr-[50px] pl-[50px] pt-[2px] pb-[2px] rounded-[20px]'>
                        Choose chat, to start conversation
                    </h2>
                </div>
            ) : messages[room].length === 0 ? (
                <div className='w-[80%] h-full flex justify-center items-center'>
                    <h2 className='text-[20px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#222222] pr-[50px] pl-[50px] pt-[2px] pb-[2px] rounded-[20px]'>
                        Chat is empty
                    </h2>
                </div>
            ) : (
                <div id='Chat' className='w-[80%] h-full flex flex-col'>
                    <div className='flex flex-col h-full overflow-y-auto'>
                        {messages[room].map((msg, idx) => (
                            <Message
                                key={idx}
                                message={msg}
                                getRepliedMessage={getRepliedMessage}
                                position={position}
                                setPosition={setPosition}
                                contextMenu={contextMenu}
                                setContextMenu={setContextMenu}
                                edidingMessage={edidingMessage}
                                setEditingMessage={setEditingMessage}
                                editMessage={editMessage}
                                deleteMessage={deleteMessage}
                            />
                        ))}
                    </div>
                    <div className='mb-[3px]'>
                        <SendMsgForm
                            messages={messages[room]}
                            room={room}
                            repliedMessage={repliedMessage}
                            setRepliedMessage={setRepliedMessage}
                            getMessageFromAdmin={getMessageFromAdmin}
                            cancelReplyMessage={cancelReplyMessage}
                        />
                    </div>
                </div>
            )}
        </>
    );
    
    // return (
    //     <>

    //         {(!room)
    //             ? <div className='w-[80%] h-full flex justify-center items-center'>
    //                 <h2 className='text-[20px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#222222] pr-[50px] pl-[50px] pt-[2px] pb-[2px] rounded-[20px]'>
    //                     Choose chat, to start conversation
    //                 </h2>
    //             </div>
    //             : (messages[room].length === 0)
    //                 ? <div className='w-[80%] h-full flex justify-center items-center'>
    //                         <h2 className='text-[20px] font-[Ubuntu] font-[400] text-[#AAAAAA] bg-[#222222] pr-[50px] pl-[50px] pt-[2px] pb-[2px] rounded-[20px]'>
    //                             Chat is empty
    //                         </h2>
    //                   <div id='Chat' className='w-[80%] h-full flex flex-col'>
    //                 : <div className='flex flex-col h-full overflow-y-auto'>
    //                     {messages[room].map((msg, idx) => (
    //                         <Message key={idx}
    //                             message={msg}

    //                             getRepliedMessage={getRepliedMessage}

    //                             position={position}
    //                             setPosition={setPosition}
    //                             contextMenu={contextMenu}
    //                             setContextMenu={setContextMenu}

    //                             edidingMessage={edidingMessage}
    //                             setEditingMessage={setEditingMessage}
    //                             editMessage={editMessage}

    //                             deleteMessage={deleteMessage}
    //                         />
    //                     ))}
    //                 </div>
    //                 <div className='mb-[3px]'>
    //                     <SendMsgForm
    //                         messages={messages[room]}
    //                         room={room}

    //                         repliedMessage={repliedMessage}
    //                         setRepliedMessage={setRepliedMessage}
    //                         getMessageFromAdmin={getMessageFromAdmin}
    //                         cancelReplyMessage={cancelReplyMessage}
    //                     />
    //                 </div>
    //             </div>
    //         }
    //     </>
    // )
}