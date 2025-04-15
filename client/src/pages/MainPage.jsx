import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHeader from '../components/Navbar.header';
import NavbarMain from '../components/Navbar.main';
import Button from '../components/UI/Button';

export default function MainPage() {
    const navigate = useNavigate();
    const goToChats = () => {
        navigate('/chats');
    }
    return (
        <div className='bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225]'>
            <header className='flex justify-between p-5'>
                <h1 className='text-[40px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#6bfff8] bg-clip-text text-transparent'>admichat</h1>
                <NavbarHeader />
            </header>
            <main className='flex flex-col items-center h-screen justify-center'>
                <h2 className='text-[50px] font-[Ubuntu] font-[500] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent'>Wellcome, dmi3mid</h2>
                <NavbarMain />
                <Button onClick={goToChats} styles='text-[20px] text-[#0f0d0f] font-[Ubuntu] font-[500] w-[200px] h-[50px] rounded-[20px] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] duration-300 hover:opacity-80'>Go to chats</Button>
            </main>
            <footer className='w-[100%] h-[80px] flex justify-center items-center'>
                <h3 className='text-[15px] font-[Ubuntu] font-[300] text-[#4afff6] opacity-50'>made by dmi3mid</h3>
            </footer>
        </div>
    )
}
