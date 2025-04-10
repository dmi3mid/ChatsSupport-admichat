import React from 'react'

import NavbarHeader from '../components/Navbar.header';
import NavbarMain from '../components/Navbar.main';
import Button from '../components/UI/Button';

export default function MainPage() {
    return (
        <div>
            <header className='flex justify-between p-5 bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225]'>
                <h1 className='text-[40px] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>admichat</h1>
                <NavbarHeader />
            </header>
            <main className='flex flex-col items-center bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225]'>
                <h2 className='text-[50px] font-[500] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>Wellcome, dmi3mid</h2>
                <NavbarMain />
                <Button styles='text-[20px] text-[#0f0d0f] font-[500] w-[200px] h-[50px] rounded-[20px] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] duration-400 hover:opacity-80'>Go to chat</Button>
            </main>
        </div>
    )
}
