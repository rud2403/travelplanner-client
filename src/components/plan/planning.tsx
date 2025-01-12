'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/plan/map';
import Timeline from '@/components/plan/timeLine';
import TravelModal from '@/components/modal/travelModal';
import travelPlanData from '@/data/travelPlanData';
import { TravelLocation } from '@/data/travelPlanData';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { saveTravelPlanAPI } from '@/services/travelPlan';

const Planning = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const router = useRouter();

  const {
    destination,
    startDate,
    endDate,
    setDateLocations,
    dateLocations,
    setSelectedDate,
    selectedDate,
    setFocusedLocation,
    setFocusedRoute,
  } = useTravelStore();

  useEffect(() => {
    if (!destination || !startDate || !endDate) {
      router.push('/'); // 데이터가 없으면 홈으로 리다이렉트
    } else {
      setDateLocations(travelPlanData); // DateLocations 설정
    }
  }, [destination, startDate, endDate, router, setDateLocations]);

  const handleRouteClick = (from: string, to: string) => {
    const fromLocation = dateLocations.flatMap(date => date.locations).find(loc => loc.name === from);
    const toLocation = dateLocations.flatMap(date => date.locations).find(loc => loc.name === to);
    if (fromLocation && toLocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${fromLocation.lat},${fromLocation.lng}&destination=${toLocation.lat},${toLocation.lng}`, '_blank');
    }
  };

  const handleRouteMouseEnter = (from: string, to: string) => {
    const route = dateLocations.flatMap(date => date.routes).find(r => r.fromLocation === from && r.toLocation === to);
    setFocusedRoute(route || null);
  };

  const handleRouteMouseLeave = () => {
    setFocusedRoute(null);
  };

  const handleLocationMouseLeave = () => {
    setFocusedLocation(null);
  };

  const handleLocationClick = (location: TravelLocation) => {
    setFocusedLocation(location); // 타임라인 클릭 시 지도 위치 이동
  };

  const handleMarkerClick = (location: TravelLocation) => {
    setSelectedLocation(location); // 마커 클릭 시 모달 열기
  };

  const handleDateClick = (date: number | null) => {
    setSelectedDate(date);
    setIsSidebarOpen(false); // 사이드바를 닫음
  };

  const handleSavePlan = async () => {
    const travelPlan = {
      destination,
      startDate,
      endDate,
      dates: dateLocations,
    };

    const jwtToken = localStorage.getItem('jwtToken');

    try {
      const result = await saveTravelPlanAPI(travelPlan, jwtToken);
      console.log('Plan saved successfully:', result);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* 사이드바 열기 아이콘 */}
      <div className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white bg-blue-600 p-3 rounded-full shadow-lg focus:outline-none"
        >
          {isSidebarOpen ? <FaArrowLeft size={24} /> : <FaArrowRight size={24} />}
        </button>
      </div>

      {/* 사이드 */}
      <aside
        className={`fixed top-16 bottom-16 left-0 z-40 w-64 p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-transparent`}
      >
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => handleDateClick(null)}
            className="flex items-center p-3 bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white rounded-md shadow-md transition duration-300"
          >
            전체 일정
          </button>
          {dateLocations.map((dateLocation, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(index)}
              className="flex items-center p-3 bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white rounded-md shadow-md transition duration-300"
            >
              {dateLocation.date}
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 */}
      <section className={`flex-grow bg-white p-8 flex flex-col text-gray-800 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="w-full max-w-6xl mx-auto mb-8 text-center">
          <div className="mb-4">
            <h2 className="text-5xl font-extrabold text-blue-600">{destination}</h2>
          </div>
          <div className="mb-8">
            <p className="text-lg text-gray-600">{startDate} ~ {endDate}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {response && (
              <div className="mt-4 p-6 bg-green-100 text-green-800 rounded-lg">
                <p className="font-bold">Response:</p>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
            {error && (
              <div className="mt-4 p-6 bg-red-100 text-red-800 rounded-lg">
                <p className="font-bold">Error:</p>
                <pre>{error}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <button
            onClick={handleSavePlan}
            className="self-end mb-4 px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            여행일정 저장
          </button>
          <div className="flex-grow flex">
            {/* 타임라인 */}
            <section className="w-1/3 pr-6">
              <Timeline
                onRouteClick={handleRouteClick}
                onRouteMouseEnter={handleRouteMouseEnter}
                onRouteMouseLeave={handleRouteMouseLeave}
                onLocationMouseLeave={handleLocationMouseLeave}
                onLocationClick={handleLocationClick}
              />
            </section>
            {/* 지도 */}
            <section className="w-2/3 flex-grow">
              <div className="w-full h-full bg-white border rounded-lg shadow-lg p-6">
                <MapComponent travelPlanData={selectedDate !== null ? [dateLocations[selectedDate]] : dateLocations} onMarkerClick={handleMarkerClick} />
              </div>
            </section>
          </div>
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