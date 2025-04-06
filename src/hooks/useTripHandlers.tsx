'use client';

import { useState } from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelPlan } from '@/types/travel';
import { saveTravelPlanAPI } from '@/services/travelPlan';

/**
 * 여행 일정 관련 이벤트 핸들러를 관리하는 커스텀 훅
 */
function useTripHandlers() {
  const [hoveredLocation, setHoveredLocation] = useState<TravelLocation | null>(null);
  
  const {
    id,
    destination,
    country,
    description,
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
    handleSavePlan
  };
}

export default useTripHandlers;
