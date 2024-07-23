'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/plan/map';
import Timeline from '@/components/plan/timeLine'; // 새로운 타임라인 컴포넌트
import TravelModal from '@/components/modal/travelModal'; // 새로운 모달 컴포넌트
import dayLocationsData from '@/services/dayLocations'; // 데이터 임포트
import { TravelLocation } from '@/services/dayLocations'; // 추가된 부분

const Planning = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null); // 수정된 부분
  const router = useRouter();

  const {
    destination,
    startDate,
    endDate,
    numberOfPeople,
    budget,
    setDayLocations,
    dayLocations,
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
    const route = dayLocations.flatMap(day => day.routes).find(r => r.from === from && r.to === to);
    setFocusedRoute(route || null);
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

  const handleLocationClick = (location: TravelLocation) => {
    setSelectedLocation(location);
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
        <div className="w-full max-w-6xl mb-4 p-6 text-center">
          <div className="mb-2">
            <h2 className="text-4xl font-bold text-blue-600">{destination}</h2>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-600">{startDate} ~ {endDate}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
            <div>
              <p className="text-xl font-semibold"><strong>인원수:</strong> {numberOfPeople}명</p>
              <p className="text-xl font-semibold"><strong>예산:</strong> {budget.toLocaleString()} 원</p>
            </div>
            {response && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                <p className="font-bold">Response:</p>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                <p className="font-bold">Error:</p>
                <pre>{error}</pre>
              </div>
            )}
          </div>
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
              onLocationClick={handleLocationClick} // 추가된 부분
            />
          </section>
          {/* 지도 */}
          <section className="w-2/3 flex-grow">
            <div className="w-full h-full bg-white border rounded-md shadow-md p-6">
              <MapComponent dayLocations={dayLocations} onMarkerClick={handleLocationClick} />
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
