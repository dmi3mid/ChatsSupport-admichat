const API_URL = 'http://localhost:2800';

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        window.location.href = '/auth';
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

export const login = async (email, password) => {
    return fetchWithAuth('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const register = async (email, password) => {
    return fetchWithAuth('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const getUsers = async () => {
    return fetchWithAuth('/getUsers');
};

export const getMessages = async () => {
    return fetchWithAuth('/getMessages');
};

export const closeChat = async (roomId, isOpened) => {
    return fetchWithAuth('/closeChat', {
        method: 'POST',
        headers: {
            'roomid': roomId,
        },
        body: JSON.stringify({ isOpened }),
    });
};

export const getBotToken = async (username) => {
    return fetchWithAuth('/getBotToken', {
        headers: {
            'username': username,
        },
    });
};

export const setBotToken = async (username, token) => {
    return fetchWithAuth('/setBotToken', {
        method: 'POST',
        headers: {
            'username': username,
        },
        body: JSON.stringify({ token }),
    });
}; 