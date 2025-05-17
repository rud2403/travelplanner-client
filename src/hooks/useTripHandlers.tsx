'use client';

import { useState } from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelPlan } from '@/types/travel';
import { saveTravelPlanAPI, exportTravelPlanToExcel, updateTravelPlanAPI } from '@/services/travelPlan';

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
    // 기존 dateLocations의 딥 카피 생성
    const updatedDateLocations = JSON.parse(JSON.stringify(dateLocations));
    
    // startDate와 endDate 검증 및 조정
    if (updatedDateLocations.length > 0) {
      // 실제 일정의 첫 번째와 마지막 날짜를 확인
      const actualStartDate = updatedDateLocations[0].date;
      const actualEndDate = updatedDateLocations[updatedDateLocations.length - 1].date;
      
      // 저장된 시작일/종료일과 실제 일정의 날짜가 다른 경우 조정
      let updatedStartDate = startDate;
      let updatedEndDate = endDate;
      
      if (actualStartDate !== startDate) {
        console.log(`시작일 조정: ${startDate} → ${actualStartDate}`);
        updatedStartDate = actualStartDate;
      }
      
      if (actualEndDate !== endDate) {
        console.log(`종료일 조정: ${endDate} → ${actualEndDate}`);
        updatedEndDate = actualEndDate;
      }
      
      // 모든 route에 dateId와 id 값이 포함되도록 확인
      updatedDateLocations.forEach((dateLocation: any) => {
        const dateId = dateLocation.id;
        
        // routes 배열이 있으면 각 route에 dateId 설정
        if (dateLocation.routes && Array.isArray(dateLocation.routes)) {
          dateLocation.routes.forEach((route: any, routeIndex: number) => {
            // dateId 설정 (이미 있으면 유지, 없으면 현재 날짜 ID 사용)
            route.dateId = route.dateId || dateId;
            
            // 중요: 기존 route에 id 값이 있다면 그대로 유지하고,
            // 없는 경우에만 0으로 설정 (새로 생성된 route임을 의미)
            // 이렇게 하면 백엔드에서 id로 기존 route를 식별할 수 있음
            if (route.id === undefined) {
              // dateLocation의 인덱스 찾기 
              const dateIndex = updatedDateLocations.findIndex((d: any) => d.id === dateId);
              
              // 이미 저장된 상태에서 불러온 route인지 확인을 위한 로그
              console.log(`Route check (${dateId}-${routeIndex}):`, 
                route.fromLocation, '→', route.toLocation, 
                '| Original ID:', dateIndex >= 0 ? dateLocations[dateIndex]?.routes?.[routeIndex]?.id : 'unknown');
              
              // 원본 데이터에서 같은 인덱스의 route id 찾기 시도
              const originalRouteId = dateIndex >= 0 ? dateLocations[dateIndex]?.routes?.[routeIndex]?.id : undefined;
              
              if (originalRouteId !== undefined) {
                // 원본 데이터에 id가 있으면 그 값을 사용
                route.id = originalRouteId;
                console.log(`Route ID 복원됨: ${originalRouteId}`);
              } else {
                // 완전히 새로운 route이거나 원본이 없는 경우
                route.id = 0;
              }
            }
          });
        }
      });
      
      // 디버깅용 로그
      console.log('API 호출 전 routes에 dateId 확인:', 
        updatedDateLocations.map((d: any) => 
          ({dateId: d.id, routes: d.routes.map((r: any) => ({dateId: r.dateId, id: r.id}))})
        )
      );
      
      return {
        destination,
        country,
        startDate: updatedStartDate,
        endDate: updatedEndDate,
        dates: updatedDateLocations,
      };
    }
    
    // 모든 route에 dateId와 id 값이 포함되도록 확인
    updatedDateLocations.forEach((dateLocation: any) => {
      const dateId = dateLocation.id;
      
      // routes 배열이 있으면 각 route에 dateId 설정
      if (dateLocation.routes && Array.isArray(dateLocation.routes)) {
        dateLocation.routes.forEach((route: any, routeIndex: number) => {
          // dateId 설정 (이미 있으면 유지, 없으면 현재 날짜 ID 사용)
          route.dateId = route.dateId || dateId;
          
          // 중요: 기존 route에 id 값이 있다면 그대로 유지하고,
          // 없는 경우에만 0으로 설정 (새로 생성된 route임을 의미)
          // 이렇게 하면 백엔드에서 id로 기존 route를 식별할 수 있음
          if (route.id === undefined) {
            // dateLocation의 인덱스 찾기 
            const dateIndex = updatedDateLocations.findIndex((d: any) => d.id === dateId);
            
            // 이미 저장된 상태에서 불러온 route인지 확인을 위한 로그
            console.log(`Route check (${dateId}-${routeIndex}):`, 
              route.fromLocation, '→', route.toLocation, 
              '| Original ID:', dateIndex >= 0 ? dateLocations[dateIndex]?.routes?.[routeIndex]?.id : 'unknown');
            
            // 원본 데이터에서 같은 인덱스의 route id 찾기 시도
            const originalRouteId = dateIndex >= 0 ? dateLocations[dateIndex]?.routes?.[routeIndex]?.id : undefined;
            
            if (originalRouteId !== undefined) {
              // 원본 데이터에 id가 있으면 그 값을 사용
              route.id = originalRouteId;
              console.log(`Route ID 복원됨: ${originalRouteId}`);
            } else {
              // 완전히 새로운 route이거나 원본이 없는 경우
              route.id = 0;
            }
          }
        });
      }
    });
    
    // 디버깅용 로그
    console.log('API 호출 전 routes에 dateId 확인:', 
      updatedDateLocations.map((d: any) => 
        ({dateId: d.id, routes: d.routes.map((r: any) => ({dateId: r.dateId, id: r.id}))})
      )
    );
    
    return {
      destination,
      country,
      startDate,
      endDate,
      dates: updatedDateLocations,
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
  
  // 여행 계획 업데이트 핸들러
  const handleUpdatePlan = async () => {
    // id가 없으면 새로운 계획을 저장하지 업데이트하지 않음
    if (!id) {
      console.error('업데이트할 여행 일정 ID가 없습니다.');
      return;
    }

    const travelPlan = {
      id,
      ...getTravelPlanData(),
    };

    try {
      const result = await updateTravelPlanAPI(travelPlan);
      console.log('여행 일정 업데이트 완료:', result);
      alert('여행 일정이 성공적으로 업데이트되었습니다!');
    } catch (error: any) {
      console.error('여행 일정 업데이트 실패:', error);
      
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
      alert('여행 일정 업데이트에 실패했습니다. 다시 시도해 주세요.');
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
    handleExportExcel,
    handleUpdatePlan
  };
}

export default useTripHandlers;
