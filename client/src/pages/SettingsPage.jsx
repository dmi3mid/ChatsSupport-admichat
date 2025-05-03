import React from 'react';
import useToken from '../hooks/useToken';

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
