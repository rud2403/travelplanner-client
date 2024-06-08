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
    <main className="flex min-h-screen">
      {/* 사이드 메뉴 */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <nav className="flex flex-col space-y-2">
          <button onClick={handleCheck} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            백단 통신체크
          </button>
          <Link href="#">
            Page 2
          </Link>
          <Link href="#">
            Page 3
          </Link>
        </nav>
      </aside>

      {/* 지도 영역 */}
      <section className="w-full bg-gray-200 p-4">
        <div className="h-full flex items-center justify-center">
          <div className="w-full h-full bg-white border rounded-md shadow-md p-4">
            <p className="text-center text-gray-600">Map Area</p>
            {/* 여기에 백단 response 표시 */}
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
        </div>
      </section>
    </main>
  );
}
