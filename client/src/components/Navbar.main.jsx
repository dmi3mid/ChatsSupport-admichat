import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MessageSquareMore, Settings, User, Folders } from 'lucide-react'

export default function NavbarMain() {
    const navigate = useNavigate();
    const goToSettings = () => {
        navigate('/settings');
    }
    return (
        <nav className='flex justify-evenly items-center w-[25%] pt-[50px] pb-[50px]'>
            <a href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#2e282e]'>
                <MessageSquareMore color='#4afff6' width={50} height={50}/>
            </a>
            <a href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#2e282e]'>
                <User color='#4afff6' width={50} height={50}/>
            </a>
            <a onClick={goToSettings} href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#2e282e]'>
                <Settings color='#4afff6' width={50} height={50}/>
            </a>
            <a href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#2e282e]'>
                <Folders color='#4afff6' width={50} height={50}/>
            </a>
        </nav>
    )
}
