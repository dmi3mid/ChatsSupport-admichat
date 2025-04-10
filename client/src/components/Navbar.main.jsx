import React from 'react'
import { MessageSquareMore, Settings, User } from 'lucide-react'

export default function NavbarMain() {
    return (
        <nav className='flex justify-evenly items-center w-[25%]'>
            <a href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#292329]'>
                <MessageSquareMore color='#4afff6' width={50} height={50}/>
            </a>
            <a href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#292329]'>
                <User color='#4afff6' width={50} height={50}/>
            </a>
            <a href="" className='flex justify-center items-center w-[60px] h-[60px] rounded-[10px] duration-300 hover:bg-[#292329]'>
                <Settings color='#4afff6' width={50} height={50}/>
            </a>
        </nav>
    )
}
