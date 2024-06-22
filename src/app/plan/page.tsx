'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchData } from '@/services/dockerTest';
import { useTravelStore } from '@/store/useTravelStore';

export default function Plan() {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    departure,
    arrival,
    startDate,
    endDate,
    numberOfPeople,
    budget,
  } = useTravelStore();

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
    <main className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-500 text-white flex flex-col p-4 shadow-lg">
        <nav className="flex flex-col space-y-4">
          <button onClick={handleCheck} className="bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-600 font-bold py-2 px-4 rounded-md transition duration-300">
            백단 통신체크
          </button>
          <Link href="#" className="flex items-center p-2 hover:bg-blue-600 rounded-md transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Page 2
          </Link>
          <Link href="#" className="flex items-center p-2 hover:bg-blue-600 rounded-md transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Page 3
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <section className="w-full bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white border rounded-md shadow-md p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to Jeju Travel Planner</h1>
          <p className="text-center text-gray-600 mb-6">Plan your perfect trip to Jeju with our AI-powered travel planner.</p>
          <div className="text-gray-600">
            <h1 className="text-4xl font-bold mb-6">Planning Details</h1>
            <p><strong>출발지:</strong> {departure}</p>
            <p><strong>도착지:</strong> {arrival}</p>
            <p><strong>여행 시작일:</strong> {startDate}</p>
            <p><strong>여행 종료일:</strong> {endDate}</p>
            <p><strong>인원수:</strong> {numberOfPeople}</p>
            <p><strong>예산:</strong> {budget} 원</p>
          </div>
          {/* Display backend response */}
          {response && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <p>Response:</p>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
