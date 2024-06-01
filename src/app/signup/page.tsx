'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
    const [message, setMessage] = useState('Hello, click the button!');

    const handleClick = async () => {
        try {
            const host = window.location.hostname === "localhost" ? 'http://localhost:8080/api/tests/Docker-test' : '/api/tests/Docker-test';

            const response = await axios.get(host);
            console.log('response : ', response);
            setMessage(`Button clicked! Response: ${response.data}`);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching data');
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Sign up Page
            <p>{message}</p>
            <button onClick={handleClick}>dd</button>
        </main>
    );
}