'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchData } from '@/services/dockerTest';

export default function Home() {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    try {
      const data = await fetchData();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResponse(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Section */}
      <section className="flex flex-1 relative">
        {/* Background GIF */}
        <div className="absolute inset-0 z-0">
          <img src="/giphy.webp" alt="Background" className="w-full h-full object-cover" />
        </div>

        <div className="w-full bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center p-6 z-10">
          <p className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
            Travel Planner와 함께 여행 일정을 짜보세요
          </p>
          <Link href="/planning">
          <button className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 transition duration-300 text-lg md:text-xl">
            일정 만들기
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
