'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/map/map';
import { fetchData } from '@/services/dockerTest';

export default function Planning() {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    departure,
    arrival,
    startDate,
    endDate,
    numberOfPeople,
    budget,
    setDeparture,
    setArrival,
    setStartDate,
    setEndDate,
    setNumberOfPeople,
    setBudget,
  } = useTravelStore();

  useEffect(() => {
    setDeparture(searchParams.get('departure') || '');
    setArrival(searchParams.get('arrival') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
    setNumberOfPeople(Number(searchParams.get('numberOfPeople')) || 1);
    setBudget(Number(searchParams.get('budget')) || 0);
  }, [searchParams, setDeparture, setArrival, setStartDate, setEndDate, setNumberOfPeople, setBudget]);

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
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-500 text-white flex flex-col p-4 shadow-lg">
        <nav className="flex flex-col space-y-4">
          <button onClick={handleCheck} className="bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-600 font-bold py-2 px-4 rounded-md transition duration-300">
            백단 통신체크
          </button>
          <button onClick={() => router.push('/page2')} className="flex items-center p-2 hover:bg-blue-600 rounded-md transition duration-300">
            Page 2
          </button>
          <button onClick={() => router.push('/page3')} className="flex items-center p-2 hover:bg-blue-600 rounded-md transition duration-300">
            Page 3
          </button>
        </nav>
      </aside>

      <section className="w-full bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white border rounded-md shadow-md p-6 text-gray-800">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to Travel Planner</h1>
          <p className="text-center text-gray-600 mb-6">Plan your perfect trip to with our AI-powered travel planner.</p>
          <h2 className="text-4xl font-bold mb-6">Planning Details</h2>
          <p><strong>출발지:</strong> {departure}</p>
          <p><strong>도착지:</strong> {arrival}</p>
          <p><strong>여행 시작일:</strong> {startDate}</p>
          <p><strong>여행 종료일:</strong> {endDate}</p>
          <p><strong>인원수:</strong> {numberOfPeople}</p>
          <p><strong>예산:</strong> {budget} 원</p>

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

          <div className="mt-6">
            <MapComponent />
          </div>
        </div>
      </section>
    </main>
  );
}
