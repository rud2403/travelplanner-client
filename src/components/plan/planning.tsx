'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/plan/map';
import Timeline from '@/components/plan/timeLine';
import travelPlanData from '@/data/travelPlanData';
import { TravelLocation } from '@/data/travelPlanData';
import { saveTravelPlanAPI } from '@/services/travelPlan';

const Planning = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [hoveredLocation, setHoveredLocation] = useState<TravelLocation | null>(null);
  const [timelineWidth, setTimelineWidth] = useState<number>(33); // 초기 타임라인 너비 33%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const resizeRef = useRef<HTMLDivElement>(null);
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
    
    // 페이지를 떠날 때 전체 일정으로 초기화 (언마운트 시)
    return () => {
      setSelectedDate(null);
    };
  }, [destination, startDate, endDate, router, setDateLocations, id, setSelectedDate]);

  // 마우스 드래그 이벤트 처리
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeRef.current) return;

    const parentElement = resizeRef.current.parentElement;
    if (!parentElement) return;

    const containerRect = parentElement.getBoundingClientRect();
    const leftOffset = e.clientX - containerRect.left;

    const newWidth = (leftOffset / containerRect.width) * 100;
    const clampedWidth = Math.min(Math.max(newWidth, 15), 50); // 최소 15%, 최대 50%
    setTimelineWidth(clampedWidth);

    document.body.style.cursor = 'col-resize';
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    setIsDragging(false);
    document.body.style.cursor = 'default';
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    setIsDragging(true);
  }, [handleMouseMove, handleMouseUp]);

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
    // 마우스 오버 시 마커만 확대하고 팝업은 표시하지 않음
    setHoveredLocation(location); 
  };

  const handleLocationMouseLeave = () => {
    setHoveredLocation(null);
  };

  const handleLocationClick = (location: TravelLocation) => {
    setFocusedLocation(location); // 타임라인 클릭 시 지도 위치 이동
  };

  const handleMarkerClick = (location: TravelLocation) => {
    setFocusedLocation(location); // 마커 클릭 시 포커스 설정
  };

  const handleDateClick = (date: number | null) => {
    setSelectedDate(date);
    // 사이드바 닫는 기능 제거
    // setIsSidebarOpen(false);
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
            className={`flex items-center p-3 ${selectedDate === null ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-blue-800 hover:bg-blue-50'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border ${selectedDate === null ? '' : 'border-blue-100'}`}
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
              className={`flex items-center p-3 ${selectedDate === index ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-blue-800 hover:bg-blue-50'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border ${selectedDate === index ? '' : 'border-blue-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${selectedDate === index ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{index + 1}일차</span>
              <span className={`ml-auto text-xs ${selectedDate === index ? 'text-gray-200' : 'text-gray-500'}`}>{dateLocation.date}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 */}
      <section className={`flex-grow bg-white p-8 flex flex-col text-gray-800 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="w-full max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-2 h-16 bg-blue-500 rounded-full mr-4"></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{destination}</h2>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{startDate} ~ {endDate}</span>
            </div>
          </div>
        </div>
        
        {/* 저장 버튼 - 이미 저장된 여행의 경우(id가 있는 경우) 표시하지 않음 */}
        {!id && (
          <div className="w-full mx-auto mb-4 flex">
            <div className="flex-1"></div> {/* 좌측 공간 - 타임라인 너비와 동일 */}
            <div className="flex-[2] flex justify-end pr-1"> {/* 오른쪽 공간 - 맵 너비와 동일 */}
              <button
                onClick={handleSavePlan}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                여행 일정 저장
              </button>
            </div>
          </div>
        )}

        <div className="flex-grow flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          {/* 타임라인 */}
          <section
            className="w-full bg-gray-50 p-4 md:overflow-auto relative"
            style={{ flex: `0 0 ${timelineWidth}%` }}
          >
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

          {/* 리사이즈 핸들 */}
          <div
            className="hidden md:flex items-center justify-center w-4 z-10 bg-gradient-to-r from-gray-100 to-white hover:from-blue-50 hover:to-blue-100 transition-colors duration-300 relative"
            onMouseDown={handleMouseDown}
            style={{ cursor: 'col-resize' }}
            ref={resizeRef}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 px-1.5">
              <div className="w-0.5 h-6 bg-gray-400 rounded-full"></div>
              <div className="w-0.5 h-6 bg-gray-400 rounded-full"></div>
              <div className="w-0.5 h-6 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* 지도 */}
          <section className="w-full flex-grow bg-white">
            <div className="w-full h-full p-4">
              <MapComponent
                travelPlanData={selectedDate !== null ? [dateLocations[selectedDate]] : dateLocations}
                onMarkerClick={handleMarkerClick}
                hoveredLocation={hoveredLocation}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Planning;