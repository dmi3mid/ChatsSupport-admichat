import React, { useEffect, useState } from 'react';
import useToken from '../hooks/useToken';
import axios from 'axios';

export default function SettingsPage() {
    const {
        token,
        inputToken,
        setInputToken,
        setBotToken,
        removeBotToken,
        error,
        loading
    } = useToken();

    // Auto-reply state
    const [autoReply, setAutoReply] = useState('');
    const [autoReplyInput, setAutoReplyInput] = useState('');
    const [autoReplyLoading, setAutoReplyLoading] = useState(false);
    const [autoReplyError, setAutoReplyError] = useState('');
    const [autoReplySuccess, setAutoReplySuccess] = useState('');
    const [autoReplyPreview, setAutoReplyPreview] = useState('');

    // Helper to get adminId from localStorage
    const getAdminId = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr).id : null;
    };

    // Fetch auto-reply on mount
    useEffect(() => {
        const fetchAutoReply = async () => {
            setAutoReplyLoading(true);
            setAutoReplyError('');
            try {
                const adminId = getAdminId();
                const res = await axios.get('http://localhost:2800/api/settings/auto-reply', {
                    headers: { 'admin-id': adminId }
                });
                setAutoReply(res.data.autoReplyStart || '');
                setAutoReplyInput(res.data.autoReplyStart || '');
                setAutoReplyPreview(res.data.autoReplyStart || '');
            } catch (err) {
                setAutoReplyError('Failed to fetch auto-reply');
            } finally {
                setAutoReplyLoading(false);
            }
        };
        fetchAutoReply();
    }, []);

    // Save auto-reply
    const saveAutoReply = async (e) => {
        e.preventDefault();
        setAutoReplyLoading(true);
        setAutoReplyError('');
        setAutoReplySuccess('');
        try {
            const adminId = getAdminId();
            await axios.post('http://localhost:2800/api/settings/auto-reply', {
                autoReplyStart: autoReplyInput
            }, {
                headers: { 'admin-id': adminId }
            });
            setAutoReply(autoReplyInput);
            setAutoReplySuccess('Auto-reply saved!');
            setAutoReplyPreview(autoReplyInput);
        } catch (err) {
            setAutoReplyError('Failed to save auto-reply');
        } finally {
            setAutoReplyLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1b1b1b] text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-[#00e4d8]">Bot Settings</h1>
                
                <div className="bg-[#222222] rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Telegram Bot Token</h2>
                    
                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {token ? (
                        <div className="mb-4">
                            <p className="text-gray-300 mb-2">Current Token:</p>
                            <div className="bg-[#1b1b1b] p-3 rounded break-all">
                                {token}
                            </div>
                            <button
                                onClick={removeBotToken}
                                disabled={loading}
                                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {loading ? 'Removing...' : 'Remove Token'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={setBotToken} className="space-y-4">
                            <div>
                                <label htmlFor="token" className="block text-gray-300 mb-2">
                                    Enter your Telegram Bot Token:
                                </label>
                                <input
                                    type="text"
                                    id="token"
                                    value={inputToken}
                                    onChange={(e) => setInputToken(e.target.value)}
                                    placeholder="Enter your bot token"
                                    className="w-full bg-[#1b1b1b] text-white p-3 rounded border border-gray-600 focus:border-[#00e4d8] focus:outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !inputToken}
                                className="bg-[#00e4d8] hover:bg-[#4afff6] text-black px-4 py-2 rounded disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Token'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Auto-reply block */}
                <div className="bg-[#222222] rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Auto-Reply Message for /start</h2>
                    <form onSubmit={saveAutoReply} className="space-y-4">
                        <div>
                            <label htmlFor="autoReply" className="block text-gray-300 mb-2">
                                Enter your auto-reply message (use double newlines for multiple messages):
                            </label>
                            <textarea
                                id="autoReply"
                                value={autoReplyInput}
                                onChange={e => setAutoReplyInput(e.target.value)}
                                rows={4}
                                className="w-full bg-[#1b1b1b] text-white p-3 rounded border border-gray-600 focus:border-[#00e4d8] focus:outline-none"
                                placeholder="Welcome! How can I help you today?"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={autoReplyLoading}
                            className="bg-[#00e4d8] hover:bg-[#4afff6] text-black px-4 py-2 rounded disabled:opacity-50"
                        >
                            {autoReplyLoading ? 'Saving...' : 'Save Auto-Reply'}
                        </button>
                        {autoReplyError && (
                            <div className="bg-red-500 text-white p-3 rounded mt-2">{autoReplyError}</div>
                        )}
                        {autoReplySuccess && (
                            <div className="bg-green-500 text-white p-3 rounded mt-2">{autoReplySuccess}</div>
                        )}
                    </form>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                        <div className="bg-[#1b1b1b] p-3 rounded border border-gray-600">
                            {autoReplyPreview.split('\n\n').map((msg, idx) => (
                                <div key={idx} className="mb-2 whitespace-pre-line">{msg}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#222222] rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Create a new bot using <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-[#00e4d8] hover:underline">@BotFather</a> on Telegram</li>
                        <li>Copy the bot token provided by BotFather</li>
                        <li>Paste the token in the input field above</li>
                        <li>Click "Save Token" to activate your bot</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
