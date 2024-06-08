'use client';

import { useState } from 'react';
import { fetchData } from '@/services/dockerTest';

export default function Signup() {
  const [message, setMessage] = useState('Hello, click the button!');

  const handleClick = async () => {
    try {
        const data = await fetchData();
        setMessage(`Button clicked! Response: ${data}`);
      } catch (error) {
        setMessage('Error fetching data');
      }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Sign up Page
      <p>{message}</p>
      <button onClick={handleClick}>Click me</button>
    </main>
  );
}
