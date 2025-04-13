'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation } from '@/types/travel';

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

// import travelPlanData from '@/data/travelPlanData';

const Planning = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
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
    handleSavePlan,
    handleExportExcel,
    handleUpdatePlan
  } = useTripHandlers();

  // 날짜 선택 핸들러
  const handleDateClick = (date: number | null) => {
    setSelectedDate(date);
  };

  // 사이드바 토글 핸들러
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // 수정 모드 토글 핸들러
  const toggleEditMode = () => {
    if (isEditMode && hasChanges) {
      // 수정 모드에서 변경사항이 있는 경우 저장 진행
      handleSaveChanges();
    } else {
      // 수정 모드로 전환
      setIsEditMode(!isEditMode);
      setHasChanges(false); // 변경사항 초기화
    }
  };
  
  // 변경사항 저장 핸들러
  const handleSaveChanges = () => {
    // 여행 계획 업데이트 API 호출
    handleUpdatePlan();
    setIsEditMode(false);
    setHasChanges(false);
  };
  
  // 변경사항 발생 시 호출될 핸들러
  const handleChange = () => {
    if (isEditMode) {
      setHasChanges(true);
    }
  };
  
  // 경로 정보 변경 핸들러
  const handleRouteChange = (updatedRoute: any, dayIndex: number, routeIndex: number) => {
    // 데이터 복사 및 위치 업데이트
    const updatedDateLocations = [...dateLocations];
    
    // 경로 정보 업데이트
    if (updatedDateLocations[dayIndex] && updatedDateLocations[dayIndex].routes[routeIndex]) {
      updatedDateLocations[dayIndex].routes[routeIndex] = updatedRoute;
      
      // Zustand 스토어 업데이트
      setDateLocations(updatedDateLocations);
      
      // 변경사항 있음을 알림
      setHasChanges(true);
      
      console.log('경로 정보 업데이트:', updatedRoute);
    }
  };
  
  // 수정된 위치가 있는지 확인
  const hasModifiedLocations = () => {
    return dateLocations.some(day =>
      day.locations.some(location => location.isModified)
    );
  };
  
  const handleLocationContentChange = (updatedLocation: TravelLocation) => {
    // 데이터 복사 및 위치 업데이트
    const updatedDateLocations = [...dateLocations];
    
    // 여행 이름과 시작 시간으로 해당 위치 찾기 (모든 여행 계획에 대해 수정 가능)
    let locationUpdated = false;
    
    // 모든 날짜와 위치를 순회하며 찾기
    for (let i = 0; i < updatedDateLocations.length; i++) {
      for (let j = 0; j < updatedDateLocations[i].locations.length; j++) {
        const location = updatedDateLocations[i].locations[j];
        
        // 같은 위치에 있는 여행인지 확인 - 경도/위도나 ID 등으로 비교
        if (Math.abs(location.lat - updatedLocation.lat) < 0.0001 && 
            Math.abs(location.lng - updatedLocation.lng) < 0.0001) {
            
          // 여행 정보 업데이트
          updatedDateLocations[i].locations[j] = {
            ...updatedLocation,
            // isModified 플래그는 그대로 유지
            isModified: location.isModified 
          };
          
          // 이름 변경 시 경로도 업데이트
          if (location.name !== updatedLocation.name) {
            updatedDateLocations[i].routes.forEach((route, routeIndex) => {
              if (route.fromLocation === location.name) {
                updatedDateLocations[i].routes[routeIndex] = {
                  ...route,
                  fromLocation: updatedLocation.name
                };
              }
              
              if (route.toLocation === location.name) {
                updatedDateLocations[i].routes[routeIndex] = {
                  ...route, 
                  toLocation: updatedLocation.name
                };
              }
            });
          }
          
          locationUpdated = true;
          break;
        }
      }
      
      if (locationUpdated) break;
    }
    
    // Zustand 스토어 업데이트
    setDateLocations(updatedDateLocations);
    
    // 변경사항 있음을 알림
    setHasChanges(true);
    
    // 디버깅 - 업데이트 로그
    console.log('업데이트된 여행 내용:', updatedLocation);
    console.log('전체 여행 데이터:', updatedDateLocations);
  };
  
  // 수정 모드에서 저장 가능 여부 확인
  // 수정 모드에서는 변경사항이 있으면 저장 가능
  const canSaveChanges = isEditMode && hasChanges;

  // 초기 데이터 로드 및 페이지 이탈 시 정리
  useEffect(() => {
    // 페이지 접근 시 데이터 유효성 검사
    if (dateLocations.length === 0 && (!destination || !startDate || !endDate)) {
      console.log('여행 계획 데이터가 없습니다. 홈으로 이동합니다.');
      router.push('/');
    }
    
    // 페이지를 떠날 때 전체 일정으로 초기화 (언마운트 시)
    return () => {
      setSelectedDate(null);
    };
  }, [destination, startDate, endDate, dateLocations, router, setSelectedDate]);
  
  // 페이지 이탈 시 변경사항 확인
  useEffect(() => {
    // 수정 모드이고 변경사항이 있을 때 페이지 이탈 방지
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditMode && hasChanges) {
        e.preventDefault();
        e.returnValue = '변경된 내용이 저장되지 않습니다. 정말 떠나시겠습니까?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditMode, hasChanges]);
  
  // 데이터 유효성 추가 검사 (렌더링 중에 예외 발생 방지)
  if (dateLocations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">여행 계획 로딩 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

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
        
        {/* 저장 버튼과 엑셀 내보내기 버튼 - id가 있으면 저장된 여행이므로 저장버튼은 표시하지 않음 */}
        <SaveButton 
          onSave={!id ? handleSavePlan : undefined} 
          onExportExcel={handleExportExcel} 
          onEdit={id ? toggleEditMode : undefined} 
          isEditMode={isEditMode}
          timelineWidth={timelineWidth} 
          showSaveButton={!id} 
          canSaveChanges={canSaveChanges}
        />

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
                isEditMode={isEditMode}
                onLocationContentChange={handleLocationContentChange}
                onRouteChange={handleRouteChange}
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
                isEditMode={isEditMode}
                onMarkerChange={handleChange}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Planning;
