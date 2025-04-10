import React from 'react'
import { LogIn, LogOut, UserRoundPlus } from 'lucide-react'


export default function Navbar() {
    return (
        <nav className='flex justify-evenly items-center w-[25%]'>
            <a href="" className='flex justify-center items-center w-[50px] h-[50px] rounded-[10px] duration-300 hover:bg-[#292329]'>
                <UserRoundPlus color='#4afff6' width={40} height={40}/>
            </a>
            <a href="" className='flex justify-center items-center w-[50px] h-[50px] rounded-[10px] duration-300 hover:bg-[#292329]'>
                <LogIn color='#4afff6' width={40} height={40}/>
            </a>
            <a href="" className='flex justify-center items-center w-[50px] h-[50px] rounded-[10px] duration-300 hover:bg-[#292329]'>
                <LogOut color='#4afff6' width={40} height={40}/>
            </a>
        </nav>        
    )
}
