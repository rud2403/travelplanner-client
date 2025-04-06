'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';

// 컴포넌트 가져오기
import MapComponent from '@/components/plan/map';
import Timeline from '@/components/plan/timeLine';
import Sidebar from '@/components/plan/Sidebar';
import TripHeader from '@/components/plan/TripHeader';
import SaveButton from '@/components/plan/SaveButton';
import SidebarToggle from '@/components/common/SidebarToggle';

// 커스텀 훅 가져오기
import useResizable from '@/hooks/useResizable';
import useTripHandlers from '@/hooks/useTripHandlers';

import travelPlanData from '@/data/travelPlanData';

const Planning = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const router = useRouter();

  const {
    destination,
    country,
    description,
    startDate,
    endDate,
    dateLocations,
    selectedDate,
    setDateLocations,
    setSelectedDate,
  } = useTravelStore();

  // 크기 조절 가능한 패널 설정
  const { width: timelineWidth, resizeRef, handleMouseDown } = useResizable();

  // 여행 관련 이벤트 핸들러
  const {
    id,
    hoveredLocation,
    handleRouteClick,
    handleRouteMouseEnter,
    handleRouteMouseLeave,
    handleLocationMouseEnter,
    handleLocationMouseLeave,
    handleLocationClick,
    handleMarkerClick,
    handleSavePlan
  } = useTripHandlers();

  // 날짜 선택 핸들러
  const handleDateClick = (date: number | null) => {
    setSelectedDate(date);
  };

  // 사이드바 토글 핸들러
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 초기 데이터 로드 및 페이지 이탈 시 정리
  useEffect(() => {
    if (!destination || !startDate || !endDate) {
      router.push('/'); // 데이터가 없으면 홈으로 리다이렉트
    } else {
      setDateLocations(travelPlanData); // DateLocations 설정
    }
    
    // 페이지를 떠날 때 전체 일정으로 초기화 (언마운트 시)
    return () => {
      setSelectedDate(null);
    };
  }, [destination, startDate, endDate, router, setDateLocations, setSelectedDate]);

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* 사이드바 토글 버튼 */}
      <SidebarToggle isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        selectedDate={selectedDate}
        dateLocations={dateLocations}
        onDateClick={handleDateClick}
      />

      {/* 메인 컨텐츠 */}
      <section className={`flex-grow bg-white p-8 flex flex-col text-gray-800 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* 여행 정보 헤더 */}
        <TripHeader
          destination={destination}
          description={description}
          startDate={startDate}
          endDate={endDate}
        />
        
        {/* 저장 버튼 - 새 여행인 경우에만 표시 */}
        {!id && <SaveButton onSave={handleSavePlan} timelineWidth={timelineWidth} />}

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
