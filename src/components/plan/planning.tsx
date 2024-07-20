'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/plan/map';
import Timeline from '@/components/plan/timeLine'; // 새로운 타임라인 컴포넌트
import TravelModal from '@/components/modal/travelModal'; // 새로운 모달 컴포넌트
import dayLocationsData, { TravelLocation } from '@/services/dayLocations'; // 데이터 임포트 및 타입 임포트

const Planning = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);
  const router = useRouter();

  const {
    destination,
    startDate,
    endDate,
    numberOfPeople,
    budget,
    setDayLocations, // 추가
    dayLocations, // 추가
    setFocusedLocation,
    setFocusedRoute,
  } = useTravelStore();

  useEffect(() => {
    if (!destination || !startDate || !endDate || !numberOfPeople || !budget) {
      router.push('/'); // 데이터가 없으면 홈으로 리다이렉트
    } else {
      setDayLocations(dayLocationsData); // dayLocations 설정
    }
  }, [destination, startDate, endDate, numberOfPeople, budget, router, setDayLocations]);

  const handleRouteClick = (from: string, to: string) => {
    const fromLocation = dayLocations.flatMap(day => day.locations).find(loc => loc.name === from);
    const toLocation = dayLocations.flatMap(day => day.locations).find(loc => loc.name === to);
    if (fromLocation && toLocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${fromLocation.lat},${fromLocation.lng}&destination=${toLocation.lat},${toLocation.lng}`, '_blank');
    }
  };

  const handleRouteMouseEnter = (from: string, to: string) => {
    const route = dayLocations.flatMap(day => day.routes).find(route => route.from === from && route.to === to);
    if (route) {
      setFocusedRoute(route);
    }
  };

  const handleRouteMouseLeave = () => {
    setFocusedRoute(null);
  };

  const handleLocationMouseEnter = (location: TravelLocation) => {
    setFocusedLocation(location);
  };

  const handleLocationMouseLeave = () => {
    setFocusedLocation(null);
  };

  return (
    <main className="flex min-h-screen bg-gray-100">
      {/* 사이드 */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-500 text-white flex flex-col p-4 shadow-lg">
        <nav className="flex flex-col space-y-4">
          <button className="bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-600 font-bold py-2 px-4 rounded-md transition duration-300">
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

      {/* 메인 */}
      <section className="w-full bg-gray-50 p-6 flex flex-col text-gray-800">
        <div className="w-full max-w-6xl mb-4">
          <h2 className="text-4xl font-bold mb-6">여행지 : {destination}</h2>
          <p><strong>여행일:</strong> {startDate} ~ {endDate}</p>
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
        </div>
        <div className="flex-grow flex">
          {/* 타임라인 */}
          <section className="w-1/3 pr-6 text-gray-800">
            <Timeline 
              onRouteClick={handleRouteClick}
              onRouteMouseEnter={handleRouteMouseEnter}
              onRouteMouseLeave={handleRouteMouseLeave}
              onLocationMouseEnter={handleLocationMouseEnter}
              onLocationMouseLeave={handleLocationMouseLeave}
            />
          </section>
          {/* 지도 */}
          <section className="w-2/3 flex-grow">
            <div className="w-full h-full bg-white border rounded-md shadow-md p-6">
              <MapComponent dayLocations={dayLocations} onMarkerClick={setSelectedLocation} />
            </div>
          </section>
        </div>
      </section>
      
      {selectedLocation && (
        <TravelModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </main>
  );
};

export default Planning;
