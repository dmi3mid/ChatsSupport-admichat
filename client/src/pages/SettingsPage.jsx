import React from 'react';

import useToken from '../hooks/useToken';

import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

export default function SettingsPage() {
    const {
        token, setToken,
        inputToken, setInputToken,
        setBotToken, removeBotToken,
    } = useToken();



    return (
        <div className='bg-[#1b1b1b]'>
            <header className='flex justify-center items-center h-[50px]'>
                <h1 className='text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
            </header>
            <main className='flex flex-col justify-center items-center h-[calc(100vh-50px)] w-[100%]'>
                <div className='flex justify-center items-center w-[90%] mb-[50px]'>
                    <h2 className='mr-[20px] text-[30px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>{token}</h2>
                    <Button onClick={removeBotToken} styles="w-[10%] ml-[20px] rounded-tl-[15px] rounded-tr-[5px] rounded-bl-[5px] rounded-br-[15px] text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] bg-[#00e4d8] duration-300 hover:opacity-80">remove token</Button>
                </div>
                <form className='flex justify-center items-center w-[90%] mt-[50px]'>
                    <Input 
                        placeholder="Type..."
                        value={inputToken}
                        onChange={ev => setInputToken(ev.target.value)}
                        styles="h-[50px] w-[90%] pl-[10px] rounded-tl-[10px] rounded-bl-[10px] text-[30px] text-[#AAAAAA] font-[Ubuntu] font-[500] bg-[#222222]"
                    />
                    <Button onClick={(ev) => setBotToken(ev)} styles="h-[50px] w-[10%] rounded-tr-[10px] rounded-br-[10px] text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] bg-[#00e4d8] duration-300 hover:opacity-80">Set token</Button>
                </form>
            </main>
        </div>
    )
}
