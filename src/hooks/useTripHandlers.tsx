'use client';

import { useState } from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelPlan } from '@/types/travel';
import { saveTravelPlanAPI, exportTravelPlanToExcel } from '@/services/travelPlan';

/**
 * 여행 일정 관련 이벤트 핸들러를 관리하는 커스텀 훅
 */
function useTripHandlers() {
  const [hoveredLocation, setHoveredLocation] = useState<TravelLocation | null>(null);
  
  const {
    id,
    destination,
    country,
    startDate,
    endDate,
    dateLocations,
    setFocusedLocation,
    setFocusedRoute,
  } = useTravelStore();

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

  // 여행 계획 데이터 구성
  const getTravelPlanData = () => {
    return {
      destination,
      country,
      startDate,
      endDate,
      dates: dateLocations,
    };
  };

  // 여행 계획 저장 핸들러
  const handleSavePlan = async () => {
    const travelPlan = getTravelPlanData();

    try {
      // axios 인스턴스가 withCredentials: true로 설정되어 있어 쿠키가 자동으로 포함됨
      const result = await saveTravelPlanAPI(travelPlan);
      console.log('여행 일정 저장 완료:', result);
      alert('여행 일정이 성공적으로 저장되었습니다!');
    } catch (error: any) {
      console.error('여행 일정 저장 실패:', error);
      
      // 인증 관련 오류 처리
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/auth/signin';
        return;
      }
      
      // 사용자를 찾을 수 없는 오류 처리
      if (error.response && error.response.data && 
          (error.response.data.message?.includes('user not found') || 
           error.response.data.message?.includes('User not found'))) {
        alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        window.location.href = '/auth/signin';
        return;
      }
      
      // 기타 오류
      alert('여행 일정 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 엑셀 내보내기 핸들러
  const handleExportExcel = async () => {
    try {
      // 저장된 여행인지 확인
      if (id) {
        // 이미 저장된 여행 ID로 내보내기
        await exportTravelPlanToExcel(id);
      } else {
        // 저장되지 않은 여행은 데이터를 직접 전송
        const travelPlan = getTravelPlanData();
        await exportTravelPlanToExcel(undefined, travelPlan);
      }
      
      console.log('엑셀 내보내기 성공');
    } catch (error: any) {
      console.error('엑셀 내보내기 실패:', error);
      
      // 인증 관련 오류 처리
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/auth/signin';
        return;
      }
      
      alert('엑셀 내보내기에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return {
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
    handleExportExcel
  };
}

export default useTripHandlers;
