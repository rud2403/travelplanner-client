// src/components/plan/Planning.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/plan/map';
import { fetchData } from '@/services/dockerTest';

const Planning = () => {
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

  const dayLocations = [
    {
      day: 1,
      locations: [
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)' },
        { lat: 34.705338, lng: 135.490059, name: 'Umeda Sky Building', description: '우메다 스카이 빌딩' },
        { lat: 34.667488, lng: 135.430238, name: 'Universal Studios Japan', description: '유니버설 스튜디오 재팬' },
        { lat: 34.652497, lng: 135.510400, name: 'Shinsekai', description: '신세카이' },
        { lat: 34.669271, lng: 135.500290, name: 'Dotonbori', description: '도톤보리' },
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)' },
      ],
    },
    {
      day: 2,
      locations: [
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)' },
        { lat: 34.654518, lng: 135.506225, name: 'Tennoji Zoo', description: '덴노지 동물원' },
        { lat: 34.661346, lng: 135.520005, name: 'Shitennoji', description: '시텐노지' },
        { lat: 34.666577, lng: 135.495953, name: 'Namba Parks', description: '난바 파크스' },
        { lat: 34.705775, lng: 135.494911, name: 'Grand Front Osaka', description: '그랜드 프론트 오사카' },
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)' },
      ],
    },
    {
      day: 3,
      locations: [
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)' },
        { lat: 35.011636, lng: 135.768029, name: 'Kiyomizu-dera', description: '기요미즈데라' },
        { lat: 35.039414, lng: 135.729243, name: 'Arashiyama Bamboo Grove', description: '아라시야마 대나무숲' },
        { lat: 35.003704, lng: 135.775204, name: 'Fushimi Inari-taisha', description: '후시미 이나리 신사' },
        { lat: 35.028011, lng: 135.794962, name: 'Nijo Castle', description: '니조 성' },
        { lat: 35.011636, lng: 135.768029, name: 'Kyoto Station', description: '숙소 (교토역)' },
      ],
    },
    {
      day: 4,
      locations: [
        { lat: 35.011636, lng: 135.768029, name: 'Kyoto Station', description: '숙소 (교토역)' },
        { lat: 35.015509, lng: 135.748181, name: 'Nishiki Market', description: '니시키 시장' },
        { lat: 35.003611, lng: 135.775278, name: 'Tofuku-ji', description: '도후쿠지' },
        { lat: 35.016206, lng: 135.748528, name: 'Gion', description: '기온' },
        { lat: 35.037643, lng: 135.725227, name: 'Kinkaku-ji', description: '금각사' },
        { lat: 35.011636, lng: 135.768029, name: 'Kyoto Station', description: '숙소 (교토역)' },
      ],
    },
  ];


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
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome to Jeju Travel Planner</h1>
          <p className="text-center text-gray-600 mb-6">Plan your perfect trip to Jeju with our AI-powered travel planner.</p>
          <h2 className="text-4xl font-bold mb-6">Planning Details</h2>
          <p><strong>여행지:</strong> {arrival}</p>
          <p><strong>여행 시작일:</strong> {startDate}</p>
          <p><strong>여행 종료일:</strong> {endDate}</p>
          <p><strong>인원수:</strong> {numberOfPeople}</p>
          <p><strong>예산:</strong> {budget} 원</p>

          {/* {response && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <p>Response:</p>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              <p>{error}</p>
            </div>
          )} */}

          <div className="mt-6">
            <MapComponent dayLocations={dayLocations} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Planning;
