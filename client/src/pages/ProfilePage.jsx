import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch('http://localhost:2800/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch profile');
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError(err.message);
                if (err.message.includes('token') || err.message.includes('unauthorized')) {
                    logout();
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, logout]);

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225]">
                <div className="text-[#4afff6] text-lg font-[Ubuntu]">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225]">
                <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg max-w-md font-[Ubuntu]">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225]">
                <div className="text-[#4afff6] text-lg font-[Ubuntu]">No profile data available</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#0f0d0f] via-[#201d20] to-[#252225] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-[#201d20]/50 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden border border-[#4afff6]/20">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-[Ubuntu] font-[500] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] bg-clip-text text-transparent">
                            Profile Information
                        </h2>
                    </div>
                    <div className="border-t border-[#4afff6]/20">
                        <dl>
                            <div className="bg-[#0f0d0f]/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-[Ubuntu] text-[#4afff6]/70">Username</dt>
                                <dd className="mt-1 text-sm text-[#4afff6] sm:mt-0 sm:col-span-2 font-[Ubuntu]">
                                    {userData.username}
                                </dd>
                            </div>
                            <div className="bg-[#201d20]/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-[Ubuntu] text-[#4afff6]/70">Email</dt>
                                <dd className="mt-1 text-sm text-[#4afff6] sm:mt-0 sm:col-span-2 font-[Ubuntu]">
                                    {userData.email}
                                </dd>
                            </div>
                            <div className="bg-[#0f0d0f]/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-[Ubuntu] text-[#4afff6]/70">Member since</dt>
                                <dd className="mt-1 text-sm text-[#4afff6] sm:mt-0 sm:col-span-2 font-[Ubuntu]">
                                    {new Date(userData.createdAt).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-[Ubuntu] font-[500] text-[#0f0d0f] bg-gradient-to-r from-[#00e4d8] via-[#4afff6] to-[#88fff9] hover:opacity-80 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4afff6]"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}