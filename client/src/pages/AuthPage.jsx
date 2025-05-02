import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHeader from '../components/Navbar.header';
import { login, register } from '../utils/api';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await (isLogin ? login(email, password) : register(email, password));
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225] min-h-screen'>
            <header className='flex justify-between p-5'>
                <h1 className='text-[40px] font-[Ubuntu] font-[500] bg-gradient-to-l from-[#00e4d8] via-[#4afff6] to-[#6bfff8] bg-clip-text text-transparent'>admichat</h1>
                <NavbarHeader />
            </header>
            
            <main className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)]'>
                <div className='bg-[#201d20] p-8 rounded-lg shadow-lg w-[400px]'>
                    <h2 className='text-[30px] font-[Ubuntu] font-[500] text-[#4afff6] mb-6 text-center'>
                        {isLogin ? 'Login' : 'Register'}
                    </h2>
                    
                    {error && (
                        <div className='bg-red-500 text-white p-3 rounded mb-4 text-center'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-[#4afff6] mb-2'>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full p-2 rounded bg-[#0f0d0f] text-white border border-[#4afff6] focus:outline-none focus:border-[#00e4d8]'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-[#4afff6] mb-2'>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full p-2 rounded bg-[#0f0d0f] text-white border border-[#4afff6] focus:outline-none focus:border-[#00e4d8]'
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className='w-full bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] text-[#0f0d0f] font-[Ubuntu] font-[500] py-2 rounded hover:opacity-90 transition-opacity'
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>

                    <div className='mt-4 text-center'>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className='text-[#4afff6] hover:text-[#00e4d8] transition-colors'
                        >
                            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                        </button>
                    </div>
                </div>
            </main>

            <footer className='w-[100%] h-[80px] flex justify-center items-center'>
                <h3 className='text-[15px] font-[Ubuntu] font-[300] text-[#4afff6] opacity-50'>made by dmi3mid</h3>
            </footer>
        </div>
    );
} 