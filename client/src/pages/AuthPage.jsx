import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();

    // If user is already authenticated, redirect to the page they tried to access
    // or to the profile page
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/profile';
        return <Navigate to={from} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? 'login' : 'register';
            const response = await fetch(`http://localhost:2800/api/auth/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            if (isLogin) {
                localStorage.setItem('token', data.token);
                login(data.user);
            } else {
                setIsLogin(true);
                setFormData({ username: '', email: '', password: '' });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-[Ubuntu] font-[500] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg font-[Ubuntu]">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-[Ubuntu] text-[#4afff6]/70">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-[#4afff6]/20 bg-[#201d20]/50 text-[#4afff6] placeholder-[#4afff6]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4afff6] focus:border-transparent font-[Ubuntu]"
                                placeholder="Username"
                            />
                        </div>
                        {!isLogin && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-[Ubuntu] text-[#4afff6]/70">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-3 py-2 border border-[#4afff6]/20 bg-[#201d20]/50 text-[#4afff6] placeholder-[#4afff6]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4afff6] focus:border-transparent font-[Ubuntu]"
                                    placeholder="Email address"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="password" className="block text-sm font-[Ubuntu] text-[#4afff6]/70">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-[#4afff6]/20 bg-[#201d20]/50 text-[#4afff6] placeholder-[#4afff6]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4afff6] focus:border-transparent font-[Ubuntu]"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-[Ubuntu] font-[500] rounded-lg text-[#0f0d0f] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] hover:opacity-80 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4afff6]"
                        >
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-[Ubuntu] text-[#4afff6] hover:text-[#88fff9] duration-300"
                    >
                        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
