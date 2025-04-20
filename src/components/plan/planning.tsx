'use client';
import { dispatchLocationUpdateEvent } from './event/LocationEvents';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation } from '@/types/travel';

// 컴포넌트 가져오기
import MapComponent from '@/components/plan/map/MapComponent';
import TimeLine from '@/components/plan/timeline/Timeline';
import Sidebar from '@/components/plan/Sidebar';
import TripHeader from '@/components/plan/TripHeader';
import SaveButton from '@/components/plan/SaveButton';
import SidebarToggle from '@/components/common/SidebarToggle';

// 커스텀 훅 가져오기
import useResizable from '@/hooks/useResizable';
import useTripHandlers from '@/hooks/useTripHandlers';

const Planning = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [addMarkerMode, setAddMarkerMode] = useState<boolean>(false);
  const [markerTarget, setMarkerTarget] = useState<{dayIndex: number, callback: (lat: number, lng: number) => void} | null>(null);
  const [tempMarkerPosition, setTempMarkerPosition] = useState<{lat: number, lng: number} | null>(null);
  const [selectedMarkerPosition, setSelectedMarkerPosition] = useState<{lat: number, lng: number} | null>(null);
  // 원본 데이터 백업 (수정 모드 취소 시 복원용)
  const [originalDateLocations, setOriginalDateLocations] = useState<any[]>([]);
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

  // 여행 계획 추가 완료 이벤트 처리
  useEffect(() => {
    // 여행일정 추가 완료 이벤트 리스너
    const handleClearSelectedMarker = () => {
      console.log('여행일정 추가 완료: 마커 제거');
      setSelectedMarkerPosition(null);
      
      // 전역 위치 상태 초기화 - 개선된 함수는 내부적으로 돌의 값을 검사하여 필요할 때만 업데이트
      useTravelStore.getState().resetLocationState();
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('clearSelectedMarker', handleClearSelectedMarker);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('clearSelectedMarker', handleClearSelectedMarker);
    };
  }, []);

  // 편집 모드 변경 시 위치 관련 상태 초기화
  useEffect(() => {
    // 수정 모드로 들어가거나 나올 때 모든 임시 위치 정보 초기화
    setTempMarkerPosition(null);
    setSelectedMarkerPosition(null);
    
    // 전역 상태 초기화 - 개선된 함수는 내부적으로 값 변경 필요 여부 확인
    useTravelStore.getState().resetLocationState();
    
    // 문제가 되는 이전 위치 값들과 임시 마커 제거를 위한 이벤트 전파
    const event = new CustomEvent('editModeChanged', { detail: { isEditMode } });
    window.dispatchEvent(event);
    
    // 콘솔에 로그 추가
    console.log('수정 모드 변경:', isEditMode, '위치 정보 초기화 완료');
  }, [isEditMode]);


  // 날짜 선택 핸들러
  const handleDateClick = (date: number | null) => {
    setSelectedDate(date);
    // preservedSelectedDate도 업데이트
    useTravelStore.getState().setPreservedSelectedDate(date);
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
      if (!isEditMode) {
        // 수정 모드 진입 시 원본 데이터 백업 - 딥 복사 사용
        const deepCopy = JSON.parse(JSON.stringify(dateLocations));
        setOriginalDateLocations(deepCopy);
        console.log('원본 데이터 백업 완료:', deepCopy);
      }
      setIsEditMode(!isEditMode);
      setHasChanges(false); // 변경사항 초기화
    }
  };

  // 수정 내용 취소 핸들러
  const handleCancelEdit = () => {
    // 수정 내용이 있을 경우 확인
    if (hasChanges) {
      const confirmCancel = window.confirm('변경사항이 있습니다. 정말 취소하시겠습니까?');
      if (!confirmCancel) {
        return; // 취소 거부
      }
    }
    
    // 수정 모드 해제
    setIsEditMode(false);
    setHasChanges(false);
    
    // 임시 마커와 위경도 정보 초기화
    setTempMarkerPosition(null);
    setSelectedMarkerPosition(null);
    setAddMarkerMode(false); // 마커 추가 모드도 비활성화
    
    // 원본 데이터로 복원
    if (originalDateLocations.length > 0) {
      console.log('원본 데이터로 복원:', originalDateLocations);
      setDateLocations([...originalDateLocations]);
    } else {
      // 원본 데이터가 없는 경우 isModified 플래그만 제거
      const updatedDateLocations = [...dateLocations];
      updatedDateLocations.forEach((dayLocation: { locations: TravelLocation[] }) => {
        dayLocation.locations.forEach(location => {
          location.isModified = false; // 수정 모드에서 나갈 때 isModified 플래그 제거
        });
      });
      setDateLocations(updatedDateLocations);
    }
    
    // 전역 상태 초기화 - 개선된 함수는 내부적으로 필요한 계산 수행
    useTravelStore.getState().resetLocationState();
    
    // 명시적으로 여행일정 추가 완료 이벤트 발생시켜 모든 마커 정리
    const clearEvent = new CustomEvent('clearSelectedMarker');
    window.dispatchEvent(clearEvent);
    
    // 콘솔에 로그 추가
    console.log('취소 버튼 클릭: 위치 정보 초기화 완료');
  };
  
  // 변경사항 저장 핸들러
  const handleSaveChanges = () => {
    // 여행 계획 업데이트 API 호출 전에 isModified 플래그 제거
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    updatedDateLocations.forEach((dayLocation: { locations: TravelLocation[] }) => {
      dayLocation.locations.forEach(location => {
        location.isModified = false; // 저장 시 isModified 플래그 제거
      });
    });
    setDateLocations(updatedDateLocations);

    // 여행 계획 업데이트 API 호출
    handleUpdatePlan();
    setIsEditMode(false);
    setHasChanges(false);
    
    // 임시 마커 정보 완전 초기화
    setTempMarkerPosition(null);
    setSelectedMarkerPosition(null);
    setAddMarkerMode(false);
    
    // 전역 상태 초기화 - 개선된 함수는 내부적으로 필요한 계산 수행
    useTravelStore.getState().resetLocationState();
    
    // 저장 완료 이벤트 전파
    const clearEvent = new CustomEvent('clearSelectedMarker');
    window.dispatchEvent(clearEvent);
    
    // 콘솔에 로그 추가
    console.log('저장 버튼 클릭: 위치 정보 초기화 완료');
  };
  
  // 변경사항 발생 시 호출될 핸들러
  const handleChange = () => {
    if (isEditMode) {
      // 변경사항 있음 표시
      setHasChanges(true);
    }
  };
  
  // 새 여행 계획이 추가되었을 때도 호출될 핸들러
  useEffect(() => {
    if (isEditMode) {
      // 변경 사항 있음 표시
      setHasChanges(true);
    }
  }, [dateLocations, isEditMode]);
  
  // 데이터가 변경될 때 preservedSelectedDate를 기반으로 선택된 일차 복원
  useEffect(() => {
    // 저장된 일차 정보가 있는지 확인
    const preservedDate = useTravelStore.getState().preservedSelectedDate;
    if (preservedDate !== null && preservedDate !== selectedDate) {
      console.log('저장된 일차 정보 복원:', preservedDate);
      setSelectedDate(preservedDate);
      // 복원 후 초기화
      useTravelStore.getState().setPreservedSelectedDate(null);
    }
  }, [dateLocations, setSelectedDate, selectedDate]);
  
  // 경로 정보 변경 핸들러
  const handleRouteChange = (updatedRoute: any, dayIndex: number, routeIndex: number) => {
    // 데이터 복사 및 위치 업데이트
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    
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
  
  const handleLocationContentChange = (updatedLocation: TravelLocation) => {
    // 데이터 복사 및 위치 업데이트 - 딥 복사 활용
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    
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

          // 이름 변경 시 경로도 업데이트 (모든 날짜의 경로를 확인)
          if (location.name !== updatedLocation.name) {
            const originalName = location.name; // 원래 이름 저장
            // Assuming 'day' has a 'routes' array and 'route' has 'fromLocation'/'toLocation'
            updatedDateLocations.forEach((day: { routes: any[] }, dayIdx: number) => { 
              day.routes.forEach((route: { fromLocation: string, toLocation: string }, routeIndex: number) => {
                if (route.fromLocation === originalName) {
                  updatedDateLocations[dayIdx].routes[routeIndex] = {
                    ...route,
                    fromLocation: updatedLocation.name
                  };
                }
                if (route.toLocation === originalName) {
                  updatedDateLocations[dayIdx].routes[routeIndex] = {
                    ...route,
                    toLocation: updatedLocation.name
                  };
                }
              });
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

  // 마커 추가 핸들러 (Map과 Timeline에서 호출됨)
  const handleAddMarker = (lat: number, lng: number, eventType?: string) => {
    // 현재 선택된 일차 값 저장 (여기서도 먼저 저장)
    const currentSelectedDate = selectedDate;
    
    // 1. 마우스 이동 시
    if (eventType === 'move') {
      // 임시 마커 위치 업데이트
      if (addMarkerMode) {
        setTempMarkerPosition({ lat, lng });
      }
      return;
    }
    
    // 2. 버튼 클릭으로 마커 추가 모드 시작
    if (!eventType || eventType === 'button') {
      console.log('마커 추가 모드 시작');
      
      // 이전에 저장된 임시 위치 정보 모두 삭제
      setTempMarkerPosition(null);
      setSelectedMarkerPosition(null);
      
      // 전역 상태 초기화 - 개선된 함수는 내부적으로 필요한 값만 초기화
      useTravelStore.getState().resetLocationState();
      
      // 마커 추가 모드 시작
      setAddMarkerMode(true);
      
      // 콘솔에 로그 추가
      console.log('마커 추가 모드 시작: 임시 위치 정보 초기화 완료');
      return;
    }
    
    // 3. 지도 클릭으로 마커 선택 완료
    if (eventType === 'click') {
      console.log('지도에서 위치 선택함:', lat, lng);
      
      // 기존 상태 초기화 후 새 임시 위치 저장
      const travelStore = useTravelStore.getState();
      
      // 먼저 초기화 후 새 값 설정 - 개선된 함수 사용
      travelStore.resetLocationState();
      
      // 새 임시 위치 정보 설정 - 이전 초기화 후 새로 설정하여 겹치지 않도록 별도 처리
      setTimeout(() => {
        travelStore.setTempSelectedLocation({
          lat: lat,
          lng: lng,
          name: "",
          type: 1,
          startTime: "",
          endTime: ""
        });
        
        // preservedSelectedDate 설정 (일차 유지)
        if (currentSelectedDate !== null) {
          travelStore.setPreservedSelectedDate(currentSelectedDate);
          console.log('선택된 일차 정보 유지됨:', currentSelectedDate);
        }
      }, 10);
      
      // 위치 선택 완료 이벤트 발생 - 구독자들에게 알림
      console.log('상태 변경 관련 주요 이벤트 발생');
      dispatchLocationUpdateEvent(lat, lng, currentSelectedDate);
      
      // 마커 추가 완료 처리
      setSelectedMarkerPosition({ lat, lng });
      setAddMarkerMode(false); // 마커 추가 모드 끝남
      setTempMarkerPosition(null); // 임시 마커 제거
      
      // 구성에서는 대부분 필요 없지만 호환성을 위해 유지
      setMarkerTarget(null);
      
      // 콘솔에 로그 추가
      console.log('마커 선택 완료: 위치', lat, lng);
      
      // 임시 위치 정보가 제대로 설정되었는지 확인
      setTimeout(() => {
        const tempLocation = useTravelStore.getState().tempSelectedLocation;
        console.log('위치 선택 후 tempSelectedLocation 확인:', tempLocation);
      }, 100);
    }
  };

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
          onCancelEdit={isEditMode ? handleCancelEdit : undefined} 
          isEditMode={isEditMode}
          timelineWidth={timelineWidth} 
          showSaveButton={!id} 
          canSaveChanges={canSaveChanges}
        />

        <div className="flex-grow flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          {/* 타임라인 */}
          <section
            className="w-full bg-gray-50 md:overflow-hidden relative"
            style={{ flex: `0 0 ${timelineWidth}%` }}
          >
            <div className="h-full overflow-auto p-4">
              <TimeLine
                onRouteClick={handleRouteClick}
                onRouteMouseEnter={handleRouteMouseEnter}
                onRouteMouseLeave={handleRouteMouseLeave}
                onLocationMouseEnter={handleLocationMouseEnter}
                onLocationMouseLeave={handleLocationMouseLeave}
                onLocationClick={handleLocationClick}
                isEditMode={isEditMode}
                onLocationContentChange={handleLocationContentChange}
                onRouteChange={handleRouteChange}
                addMarkerMode={addMarkerMode}
                setAddMarkerMode={setAddMarkerMode}
                onAddMarker={handleAddMarker}
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
                addMarkerMode={addMarkerMode}
                tempMarkerPosition={addMarkerMode ? tempMarkerPosition : selectedMarkerPosition}
                onAddMarker={handleAddMarker}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Planning;
