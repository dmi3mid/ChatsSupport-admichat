import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useToken() {
    const [token, setTokenState] = useState("");
    const [inputToken, setInputToken] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getToken();
    }, []);

    const getToken = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('User not authenticated');
            }

            const response = await axios.get('http://localhost:2800/getBotToken', {
                headers: {
                    'admin-id': user.id
                }
            });
            setTokenState(response.data.token || "");
        } catch (err) {
            console.error('Error getting token:', err);
            setError(err.response?.data?.error || 'Failed to get bot token');
        } finally {
            setLoading(false);
        }
    };

    const setBotToken = async (ev) => {
        try {
            ev.preventDefault();
            setLoading(true);
            setError(null);

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('User not authenticated');
            }

            if (!inputToken) {
                throw new Error('Token is required');
            }

            const response = await axios.post('http://localhost:2800/setBotToken', 
                { token: inputToken }, 
                {
                    headers: {
                        'admin-id': user.id
                    }
                }
            );

            if (response.data.success) {
                setTokenState(inputToken);
                setInputToken('');
            } else {
                throw new Error(response.data.error || 'Failed to set token');
            }
        } catch (err) {
            console.error('Error setting token:', err);
            setError(err.response?.data?.error || err.message || 'Failed to set bot token');
        } finally {
            setLoading(false);
        }
    };

    const removeBotToken = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('User not authenticated');
            }

            const response = await axios.post('http://localhost:2800/setBotToken', 
                { token: null }, 
                {
                    headers: {
                        'admin-id': user.id
                    }
                }
            );

            if (response.data.success) {
                setTokenState("");
            } else {
                throw new Error(response.data.error || 'Failed to remove token');
            }
        } catch (err) {
            console.error('Error removing token:', err);
            setError(err.response?.data?.error || err.message || 'Failed to remove bot token');
        } finally {
            setLoading(false);
        }
    };

    return {
        token,
        inputToken,
        setInputToken,
        setBotToken,
        removeBotToken,
        error,
        loading
    };
}
