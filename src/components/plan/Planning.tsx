'use client';
import { dispatchLocationUpdateEvent } from './event/LocationEvents';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelRoute } from '@/types/travel';

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
      // 수정 모드에서 변경사항이 있는 경우 저장하기 전에 빈 일차 검사
      const emptyDayIndex = dateLocations.findIndex(day => 
        day.locations.length === 0
      );

      if (emptyDayIndex !== -1) {
        alert(`${emptyDayIndex + 1}일차가 비어 있습니다. 모든 일차에 최소한 하나 이상의 일정을 추가해 주세요.`);
        // 비어 있는 일차로 선택 변경
        setSelectedDate(emptyDayIndex);
        return;
      }
      
      // 저장 진행
      handleSaveChanges();
    } else {
      // 수정 모드로 전환
      if (!isEditMode) {
        // 수정 모드 진입 시 원본 데이터 백업 - 딥 복사 사용
        const deepCopy = JSON.parse(JSON.stringify(dateLocations));
        setOriginalDateLocations(deepCopy);
        console.log('원본 데이터 백업 완료:', deepCopy);
      }
      const newEditMode = !isEditMode;
      setIsEditMode(newEditMode);
      console.log('수정 모드 변경됨:', newEditMode); // 수정 모드 변경 로그 추가
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
      
      // 전체 일정 탭으로 이동 (selectedDate = null)
      setSelectedDate(null);
    } else {
      // 원본 데이터가 없는 경우 isModified 플래그만 제거
      const updatedDateLocations = [...dateLocations];
      updatedDateLocations.forEach((dayLocation: { locations: TravelLocation[] }) => {
        dayLocation.locations.forEach(location => {
          location.isModified = false; // 수정 모드에서 나갈 때 isModified 플래그 제거
        });
      });
      setDateLocations(updatedDateLocations);
      
      // 전체 일정 탭으로 이동
      setSelectedDate(null);
    }
    
    // 전역 상태 초기화 - 개선된 함수는 내부적으로 필요한 계산 수행
    useTravelStore.getState().resetLocationState();
    
    // 명시적으로 여행일정 추가 완료 이벤트 발생시켜 모든 마커 정리
    const clearEvent = new CustomEvent('clearSelectedMarker');
    window.dispatchEvent(clearEvent);
    
    // 콘솔에 로그 추가
    console.log('취소 버튼 클릭: 위치 정보 초기화 완료, 전체 일정 탭으로 이동');
  };
  
  // 여행지 삭제 핸들러
  const handleLocationDelete = (locationToDelete: TravelLocation, dayIndex: number) => {
    console.log('여행지 삭제 핸들러 호출:', locationToDelete, dayIndex);
    
    // 현재 선택된 일차 값 저장
    const currentSelectedDate = selectedDate;
    
    // 데이터 복사 - 불변성 유지를 위한 딥 복사
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    
    // 해당 일차에서 여행지 찾아 삭제
    if (updatedDateLocations[dayIndex] && updatedDateLocations[dayIndex].locations) {
      // 삭제할 위치의 인덱스 찾기
      const locationIndex = updatedDateLocations[dayIndex].locations.findIndex(
        (loc: TravelLocation) => 
          Math.abs(loc.lat - locationToDelete.lat) < 0.0001 && 
          Math.abs(loc.lng - locationToDelete.lng) < 0.0001
      );
      
      if (locationIndex !== -1) {
        // 삭제할 여행지 이름 저장 (경로 업데이트에 필요)
        const deletedLocationName = updatedDateLocations[dayIndex].locations[locationIndex].name;
        
        // 여행지 삭제
        updatedDateLocations[dayIndex].locations.splice(locationIndex, 1);
        
        // 경로 재구성
        if (updatedDateLocations[dayIndex].routes) {
          // 삭제된 여행지가 포함된 경로만 삭제
          const originalRoutes = updatedDateLocations[dayIndex].routes.filter(
            (route: TravelRoute) => 
              route.fromLocation !== deletedLocationName && 
              route.toLocation !== deletedLocationName
          );
          
          // 남은 여행지들의 연결 정보 만들기
          const locations = updatedDateLocations[dayIndex].locations;
          const pairs: {from: string, to: string}[] = [];
          
          // 연결되어야 하는 여행지 쌍 생성
          for (let i = 0; i < locations.length - 1; i++) {
            pairs.push({
              from: locations[i].name,
              to: locations[i + 1].name
            });
          }
          
          // 새로운 경로 배열 생성
          const newRoutes: TravelRoute[] = [];
          
          // 각 연결 쌍에 대해
          for (const pair of pairs) {
            // 기존 경로에 존재하는지 확인
            const existingRoute = originalRoutes.find(
              (route: TravelRoute) => 
                route.fromLocation === pair.from && 
                route.toLocation === pair.to
            );
            
            if (existingRoute) {
              // 기존 경로가 있다면 그대로 유지
              newRoutes.push(existingRoute);
            } else {
              // 기존 경로가 없다면 새로 생성
              const newRoute: TravelRoute = {
                fromLocation: pair.from,
                toLocation: pair.to,
                transportationType: 1, // 기본 이동수단 (자동차)
                method: 1,
                time: '30', // 기본 30분
                dateId: updatedDateLocations[dayIndex].id,
                id: 0 // 새 경로는 id를 0으로 설정하여 백엔드가 새 ID를 할당하도록 함
              };
              newRoutes.push(newRoute);
            }
          }
          
          // 경로 배열 바꾸기
          updatedDateLocations[dayIndex].routes = newRoutes;
        }
        
        // 상태 업데이트 - 하나의 업데이트로 병합하여 화면 깜빡임 방지
        useTravelStore.setState({
          dateLocations: updatedDateLocations,
          selectedDate: currentSelectedDate
        });
        
        // 변경사항 있음을 표시
        setHasChanges(true);
        
        console.log('여행지 삭제 완료:', deletedLocationName);
        return true;
      }
    }
    
    console.log('삭제할 여행지를 찾을 수 없습니다');
    return false;
  };
  
  // 변경사항 저장 핸들러
  const handleSaveChanges = () => {
    // 저장 전 비어있는 일차가 있는지 확인
    const emptyDayIndex = dateLocations.findIndex(day => 
      day.locations.length === 0
    );

    // 비어있는 일차가 있으면 저장 제한
    if (emptyDayIndex !== -1) {
      alert(`${emptyDayIndex + 1}일차가 비어 있습니다. 모든 일차에 최소한 하나 이상의 일정을 추가해 주세요.`);
      // 비어 있는 일차로 선택 변경
      setSelectedDate(emptyDayIndex);
      return;
    }
    
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
    if (preservedDate !== null && selectedDate !== preservedDate) {
      // 즉시 상태를 일괄 업데이트하여 화면 깜빡임 방지
      console.log('저장된 일차 정보로 즉시 업데이트:', preservedDate);
      useTravelStore.setState({
        selectedDate: preservedDate,
        preservedSelectedDate: null
      });
    }
  }, [dateLocations, selectedDate]);
  
  // 선택된 날짜가 유효한지 확인하는 useEffect
  useEffect(() => {
    // dateLocations가 비어있지 않고 선택된 날짜가 범위를 벗어난 경우
    if (dateLocations.length > 0 && 
        selectedDate !== null && 
        (selectedDate < 0 || selectedDate >= dateLocations.length || !dateLocations[selectedDate])) {
      console.log('선택된 날짜가 유효하지 않습니다:', selectedDate, '유효 범위:', 0, '-', dateLocations.length - 1);
      // 전체 일정 탭으로 이동
      setSelectedDate(null);
    }
  }, [dateLocations, selectedDate, setSelectedDate]);
  
  // 경로 정보 변경 핸들러
  const handleRouteChange = (updatedRoute: any, dayIndex: number, routeIndex: number) => {
    console.log('경로 정보 변경 핸들러 호출:', updatedRoute, dayIndex, routeIndex);
    // 현재 selectedDate 값을 저장
    const currentSelectedDate = selectedDate;
    
    if (dayIndex >= 0 && routeIndex >= 0) {
      // 딥 복사를 통해 불변성 유지
      const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
      
      // 해당 일차와 경로의 인덱스가 유효한지 확인
      if (updatedDateLocations[dayIndex] && updatedDateLocations[dayIndex].routes && 
          updatedDateLocations[dayIndex].routes[routeIndex]) {
        // 경로 정보 업데이트
        const existingRouteId = updatedDateLocations[dayIndex].routes[routeIndex].id; 
        
        updatedDateLocations[dayIndex].routes[routeIndex] = {
          ...updatedRoute,
          dateId: updatedDateLocations[dayIndex].id,
          id: existingRouteId || 0 // 기존 id가 없으면 0으로 설정하여 백엔드가 처리하도록 함
        };
        
        // 전체 데이터 업데이트 - 하나의 업데이트로 병합하여 화면 깜빡임 방지
        useTravelStore.setState({
          dateLocations: updatedDateLocations,
          selectedDate: currentSelectedDate
        });
        
        // 변경사항이 있음을 기록
        setHasChanges(true);
      }
      
      console.log('경로 정보 업데이트:', updatedRoute);
    }
  };
  
  const handleLocationContentChange = (updatedLocation: TravelLocation) => {
    // 현재 선택된 일차 값 저장
    const currentSelectedDate = selectedDate;
    
    // 데이터 복사 및 위치 업데이트 - 딥 복사 활용
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    
    // 여행 이름과 시작 시간으로 해당 위치 찾기
    let locationUpdated = false;
    
    // 선택한 날짜가 있다면 해당 날짜의 위치만 업데이트, 없으면 전체 검색
    const daysToUpdate = currentSelectedDate !== null 
                        ? [currentSelectedDate]  // 선택된 날짜만 업데이트
                        : Array.from({ length: updatedDateLocations.length }, (_, i) => i); // 전체 날짜
    
    // 특정 일차만 찾아서 처리
    for (const dayIndex of daysToUpdate) {
      const dayLocations = updatedDateLocations[dayIndex]?.locations;
      if (!dayLocations) continue;
      
      for (let j = 0; j < dayLocations.length; j++) {
        const location = dayLocations[j];
        
        // 같은 위치에 있는 여행인지 확인 - 경도/위도나 ID 등으로 비교
        if (Math.abs(location.lat - updatedLocation.lat) < 0.0001 && 
            Math.abs(location.lng - updatedLocation.lng) < 0.0001) {
            
          // 여행 정보 업데이트
          updatedDateLocations[dayIndex].locations[j] = {
            ...updatedLocation,
            // isModified 플래그는 그대로 유지
            isModified: location.isModified 
          };

          // 이름 변경 시 경로도 업데이트 (변경된 날짜의 경로만 업데이트)
          if (location.name !== updatedLocation.name) {
            const originalName = location.name; // 원래 이름 저장
            
            // 해당 날짜의 경로만 업데이트
            const routes = updatedDateLocations[dayIndex].routes;
            for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
              const route = routes[routeIndex];
              
              // 반드시 원본 route의 id 값을 명시적으로 유지
              const routeId = route.id || 0; // id가 없으면 0으로 설정
              
              if (route.fromLocation === originalName) {
                updatedDateLocations[dayIndex].routes[routeIndex] = {
                  ...route,
                  fromLocation: updatedLocation.name,
                  dateId: updatedDateLocations[dayIndex].id,
                  id: routeId // 명시적으로 id 값 유지 (0 포함)
                };
              }
              if (route.toLocation === originalName) {
                updatedDateLocations[dayIndex].routes[routeIndex] = {
                  ...route,
                  toLocation: updatedLocation.name,
                  dateId: updatedDateLocations[dayIndex].id,
                  id: routeId // 명시적으로 id 값 유지 (0 포함)
                };
              }
            }
          }

          locationUpdated = true;
          break;
        }
      }
      
      if (locationUpdated) break;
    }
    
    // Zustand 스토어 업데이트 - 하나의 업데이트로 병합하여 화면 깜빡임 방지
    // 데이터 변경 시 selectedDate 유지하도록 함께 설정
    useTravelStore.setState({
      dateLocations: updatedDateLocations,
      selectedDate: currentSelectedDate
    });
    
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
        const message = '변경된 내용이 저장되지 않습니다. 정말 떠나시겠습니까?';
        e.preventDefault();
        return message;
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

  // N일차 삭제 핸들러
  const handleDeleteDay = (dayIndex: number) => {
    if (!isEditMode) {
      alert('수정 모드에서만 일차를 삭제할 수 있습니다.');
      return;
    }

    // 마지막 남은 일차를 삭제하려는 경우 방지
    if (dateLocations.length === 1) {
      alert('여행에는 최소한 하루 일정이 포함되어야 합니다.');
      return;
    }

    // 삭제 확인
    const confirmDelete = window.confirm(`${dayIndex + 1}일차를 삭제하시겠습니까? 해당 일차의 모든 일정과 경로가 삭제됩니다.`);
    if (!confirmDelete) {
      return;
    }

    try {
      // 데이터의 깊은 복사를 생성
      const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
      
      // 삭제할 일차의 정보 로그
      console.log(`삭제할 일차: ${dayIndex+1}일차, 날짜:`, updatedDateLocations[dayIndex].date);
      
      // 삭제 전 일정에서 모든 날짜 가져오기 (YYYY-MM-DD 형식)
      const allDates = updatedDateLocations.map((day: { date: any; }) => day.date);
      console.log('일차 삭제 전 전체 날짜:', allDates);
      
      // 해당 일차 삭제
      updatedDateLocations.splice(dayIndex, 1);
      console.log('일차 삭제 후 개수:', updatedDateLocations.length);
      
      // 삭제 후 일차를 순회하면서 일차 번호와 날짜 조정
      for (let i = 0; i < updatedDateLocations.length; i++) {
        // 일차 인덱스 업데이트
        updatedDateLocations[i].tripIndex = i;
        
        // 삭제된 일차 이후의 날짜 조정
        if (i >= dayIndex) {
          // i번째 일차는 삭제 전 (i+1)번째 일차의 날짜를 사용
          const newDate = allDates[i + 1];
          if (newDate) {
            updatedDateLocations[i].date = newDate;
            console.log(`새로운 ${i+1}일차의 날짜:`, newDate);
          }
        }
      }
      
      // 새로운 날짜 가 적용된 후의 일정 로그
      const updatedDates = updatedDateLocations.map((day: { date: any; }, idx: number) => `${idx+1}일차: ${day.date}`);
      console.log('업데이트된 날짜 정보:', updatedDates);
      
      // 날짜 벗어나는 문제를 해결하기 위해 추가 처리
      // 1. 모든 일차의 날짜를 순차적으로 다시 계산
      if (updatedDateLocations.length > 0) {
        // 첫번째 일차의 날짜를 기준으로 하여 일차 순서대로 날짜 계산
        const firstDay = new Date(updatedDateLocations[0].date);

        // 남은 일차의 날짜를 첫번째 일의 날짜로부터 순서대로 계산
        for (let i = 1; i < updatedDateLocations.length; i++) {
          const nextDate = new Date(firstDay);
          nextDate.setDate(firstDay.getDate() + i); // i일 후의 날짜
          
          // YYYY-MM-DD 형식으로 변환
          updatedDateLocations[i].date = nextDate.toISOString().split('T')[0];
          console.log(`일차 ${i+1}의 재계산된 날짜:`, updatedDateLocations[i].date);
        }
        
        // 시작일과 종료일 업데이트
        const newStartDate = updatedDateLocations[0].date;
        const newEndDate = updatedDateLocations[updatedDateLocations.length - 1].date;
        
        // store에 새로운 시작일과 종료일 설정
        useTravelStore.setState({ 
          startDate: newStartDate,
          endDate: newEndDate
        });
        
        console.log('시작일과 종료일 업데이트:', { 
          newStartDate, 
          newEndDate 
        });
      }
      
      // 전체 상태 업데이트
      setDateLocations(updatedDateLocations);
      
      // 선택된 일차 조정
      if (selectedDate !== null) {
        // 선택된 일차가 삭제된 경우 선택 초기화
        if (selectedDate === dayIndex) {
          setSelectedDate(null);
        }
        // 선택된 일차가 삭제된 일차 이후에 있는 경우 인덱스 조정
        else if (selectedDate > dayIndex) {
          setSelectedDate(selectedDate - 1);
        }
      }
      
      // 변경사항 있음 표시
      setHasChanges(true);
      
      console.log(`${dayIndex + 1}일차가 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error('일차 삭제 중 오류 발생:', error);
      alert('일차 삭제 중 오류가 발생했습니다.');
    }
  };

  // N일차 추가 핸들러
  const handleAddNewDay = () => {
    if (!isEditMode) {
      alert('수정 모드에서만 일차를 추가할 수 있습니다.');
      return;
    }

    // 비어있는 일차가 있는지 확인
    const emptyDayIndex = dateLocations.findIndex(day => 
      day.locations.length === 0
    );

    // 비어있는 일차가 있으면 추가 제한
    if (emptyDayIndex !== -1) {
      alert(`${emptyDayIndex + 1}일차가 비어 있습니다. 새로운 일차를 추가하기 전에 비어 있는 일차에 일정을 추가해 주세요.`);
      // 비어 있는 일차로 선택 변경
      setSelectedDate(emptyDayIndex);
      return;
    }

    // 기존 일정 데이터 복사
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    
    // 새로운 일차 인덱스 계산
    const newDayIndex = updatedDateLocations.length;
    
    // 날짜 계산 (마지막 일차 날짜 + 1일)
    let newDateStr = '';
    if (updatedDateLocations.length > 0) {
      const lastDate = new Date(updatedDateLocations[updatedDateLocations.length - 1].date);
      lastDate.setDate(lastDate.getDate() + 1);
      newDateStr = lastDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    } else if (startDate) {
      // 기존 일정이 없으면 시작일 사용
      newDateStr = startDate;
    } else {
      // 시작일도 없으면 오늘 날짜
      newDateStr = new Date().toISOString().split('T')[0];
    }
    
    // 새 일차 객체 생성
    const newDay = {
      date: newDateStr,
      tripIndex: newDayIndex,
      locations: [],
      routes: [],
    };
    
    // 새 일차 추가
    updatedDateLocations.push(newDay);
    
    // 일정 데이터 업데이트
    setDateLocations(updatedDateLocations);
    
    // 종료일 업데이트
    if (updatedDateLocations.length > 0) {
      // 새로운 종료일은 마지막 일차의 날짜
      const newEndDate = newDateStr;
      
      // store에 새로운 종료일 설정
      useTravelStore.setState({ 
        endDate: newEndDate
      });
      
      console.log('종료일 업데이트:', newEndDate);
    }
    
    // 새로 추가된 일차로 선택 변경
    setSelectedDate(newDayIndex);
    
    // 변경사항 있음 표시
    setHasChanges(true);
    
    console.log(`새로운 ${newDayIndex + 1}일차가 추가되었습니다.`);
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
        isEditMode={isEditMode}
        onAddNewDay={handleAddNewDay}
        onDeleteDay={handleDeleteDay}
      />

      {/* 메인 컨텐츠 */}
      <section className={`flex-grow bg-white p-4 md:p-8 flex flex-col text-gray-800 transition-all duration-300 overflow-x-auto min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="min-w-max sm:min-w-0 pb-4">
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
            onEdit={toggleEditMode} 
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
                  onLocationDelete={handleLocationDelete}
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
              <div className="w-full h-full p-4 min-h-[600px]">
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
        </div>
      </section>
    </main>
  );
};

export default Planning;
