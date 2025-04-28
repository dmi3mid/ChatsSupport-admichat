import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function useToken() {
    const [token, setToken] = useState("");
    const [inputToken, setInputToken] = useState("");


    useEffect(() => {
        const getToken = async () => {
            const response = await axios.get('http://localhost:2800/getBotToken', {
                headers: {
                    "username": "dmi3mid_admin"
                }
            });
            const botToken = response.data.token;
            setToken(botToken);
        }
        getToken();
    }, []);


    const setBotToken = (ev) => {
        try {
            ev.preventDefault();
            setToken(inputToken);
            setInputToken('');

            const sendBotToken = async () => {
                const response = await axios.post('http://localhost:2800/setBotToken', {token: token}, {
                    headers: {
                        username: "dmi3mid_admin"
                    }
                });
            }
            sendBotToken();
        } catch (error) {
            console.log(error);
        }
    }

    const removeBotToken = () => {
        setToken("empty token");
    }

    return {
        token, setToken,
        inputToken, setInputToken,
        setBotToken, removeBotToken,
    }
}
