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
  const [hoveredLocation, setHoveredLocation] = useState<TravelLocation | null>(null);
  const router = useRouter();

  const {
    id,
    destination,
    country,
    description,
    startDate,
    endDate,
    dateLocations,
    selectedDate,
    setDateLocations,
    setSelectedDate,
    setFocusedLocation,
    setFocusedRoute,
  } = useTravelStore();

  useEffect(() => {
    if (!destination || !startDate || !endDate) {
      router.push('/'); // 데이터가 없으면 홈으로 리다이렉트
    } else {
      setDateLocations(travelPlanData); // DateLocations 설정
      console.log('id: ', id);
    }
  }, [destination, startDate, endDate, router, setDateLocations, id]);

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

  const handleLocationMouseEnter = (location: TravelLocation) => {
    setHoveredLocation(location); // 마우스 오버 시 마커만 확대
  };

  const handleLocationMouseLeave = () => {
    setHoveredLocation(null);
  };

  const handleLocationClick = (location: TravelLocation) => {
    setFocusedLocation(location); // 타임라인 클릭 시 지도 위치 이동
    
    // 일시적으로 포커스 설정 후 해제 (0.8초 후)
    setTimeout(() => {
      setFocusedLocation(null);
    }, 800);
  };

  const handleMarkerClick = (location: TravelLocation) => {
    setFocusedLocation(location); // 마커 클릭 시 포커스 설정
    setSelectedLocation(location); // 마커 클릭 시 모달 열기
    
    // 일시적으로 포커스 설정 후 해제 (0.8초 후)
    setTimeout(() => {
      setFocusedLocation(null);
    }, 800);
  };

  const handleDateClick = (date: number | null) => {
    setSelectedDate(date);
    setIsSidebarOpen(false); // 사이드바를 닫음
  };

  const handleSavePlan = async () => {
    const travelPlan = {
      destination,
      country,
      startDate,
      endDate,
      dates: dateLocations,
    };

    const jwtToken = localStorage.getItem('jwtToken');

    try {
      const result = await saveTravelPlanAPI(travelPlan, jwtToken);
      console.log('여행 일정 저장 완료:', result);
      alert('여행 일정이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('여행 일정 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* 사이드바 열기 아이콘 */}
      <div className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-50 transition-all duration-300 ${isSidebarOpen ? 'translate-x-64' : 'translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="group relative flex items-center justify-center h-12 w-12 bg-white rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t border-r border-b border-blue-100 focus:outline-none overflow-hidden"
          aria-label={isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-center">
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </div>
          <span className="sr-only">{isSidebarOpen ? '닫기' : '열기'}</span>
          
          {/* 툴팁 */}
          <div className={`absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSidebarOpen ? 'hidden' : 'block'}`}>
            일정 보기
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </button>
      </div>

      {/* 사이드 */}
      <aside
        className={`fixed top-16 bottom-16 left-0 z-40 w-64 p-6 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } bg-gradient-to-b from-blue-50 to-indigo-50 rounded-r-2xl border-r border-t border-b border-blue-100`}
      >
        <h2 className="text-xl font-bold mb-6 text-blue-800 text-center border-b border-blue-200 pb-4">여행 일정</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => handleDateClick(null)}
            className="flex items-center p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            전체 일정
          </button>
          {dateLocations.map((dateLocation, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(index)}
              className="flex items-center p-3 bg-white text-blue-800 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 border border-blue-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{index + 1}일차</span>
              <span className="ml-auto text-xs text-gray-500">{dateLocation.date}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 */}
      <section className={`flex-grow bg-white p-8 flex flex-col text-gray-800 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="w-full max-w-6xl mx-auto mb-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
          <div className="mb-4">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{destination}</h2>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-2">{description}</p>
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{startDate} ~ {endDate}</span>
            </div>
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
          {id == 0 && (
            <button
              onClick={handleSavePlan}
              className="self-end mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              여행 일정 저장
            </button>
          )}
          <div className="flex-grow flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* 타임라인 */}
            <section className="w-full md:w-1/3 pr-0 md:pr-6 bg-gray-50 p-4">
              <div className="sticky top-4">
              <Timeline
                onRouteClick={handleRouteClick}
                onRouteMouseEnter={handleRouteMouseEnter}
                onRouteMouseLeave={handleRouteMouseLeave}
                onLocationMouseEnter={handleLocationMouseEnter}
                onLocationMouseLeave={handleLocationMouseLeave}
                onLocationClick={handleLocationClick}
              />
              </div>
            </section>
            {/* 지도 */}
            <section className="w-full md:w-2/3 flex-grow bg-white">
              <div className="w-full h-full p-4">
                <MapComponent 
                  travelPlanData={selectedDate !== null ? [dateLocations[selectedDate]] : dateLocations} 
                  onMarkerClick={handleMarkerClick} 
                  hoveredLocation={hoveredLocation}
                />
              </div>
            </section>
          </div>
        </div>
      </section>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm flex items-center justify-center">
          <TravelModal
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </main>
  );
};

export default Planning;