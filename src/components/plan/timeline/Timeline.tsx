'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { LocationHandlerProps, RouteHandlerProps, TravelLocation } from '@/types/travel';
import DayCard from './DayCard';

interface TimelineProps extends LocationHandlerProps, RouteHandlerProps {
  isEditMode?: boolean;
  onLocationContentChange?: (location: TravelLocation) => void;
  onRouteChange?: (route: any, dayIndex: number, routeIndex: number) => void;
  addMarkerMode?: boolean;
  setAddMarkerMode?: (mode: boolean) => void;
  onAddMarker?: (lat: number, lng: number, eventType: any) => void;
}

/**
 * 여행 일정 타임라인 컴포넌트
 */
const Timeline: React.FC<TimelineProps> = ({
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  onLocationMouseEnter,
  onLocationMouseLeave,
  onLocationClick,
  isEditMode = false,
  onLocationContentChange,
  onRouteChange,
  addMarkerMode = false,
  setAddMarkerMode,
  onAddMarker
}) => {
  const router = useRouter();
  const dateLocations = useTravelStore((state) => state.dateLocations);
  const selectedDate = useTravelStore((state) => state.selectedDate);
  const colors = useTravelStore((state) => state.colors);

  // 데이터가 없는 경우 로딩 상태 표시
  if (!dateLocations || dateLocations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-lg font-medium">일정 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 선택한 날짜가 유효한지 확인
  const isValidSelectedDate = selectedDate !== null && 
                             selectedDate >= 0 && 
                             selectedDate < dateLocations.length &&
                             dateLocations[selectedDate] !== undefined;
  
  // 표시할 데이터 결정 및 유효성 확인
  let displayLocations = isValidSelectedDate ? 
                        [dateLocations[selectedDate]] : 
                        dateLocations;
  
  // 추가 안전장치: 배열에 undefined 요소가 있는지 확인하고 필터링
  displayLocations = displayLocations.filter(item => item !== undefined);
  
  // 여전히 표시할 데이터가 없는 경우 빈 배열로 설정
  if (!displayLocations || displayLocations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-lg font-medium">표시할 일정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-6">
      <style jsx global>{`
        /* 스크롤바 스타일 지정 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>

      {displayLocations.map((dateLocation, dateIndex) => {
        // dateLocation이 undefined인 경우 빈 요소를 반환
        if (!dateLocation) return null;
        
        // 필요한 모든 속성에 대한 안전 체크 (undefined인 경우 기본값 제공)
        const safeDateLocation = {
          ...dateLocation,
          date: dateLocation.date || `unknown-date-${dateIndex}`,
          locations: Array.isArray(dateLocation.locations) ? dateLocation.locations : [],
          routes: Array.isArray(dateLocation.routes) ? dateLocation.routes : []
        };
        
        // 유효한 일차 인덱스 계산
        const dayIdx = selectedDate !== null ? selectedDate : dateIndex;
        // 유효한 색상 인덱스 계산 (colors 배열 범위를 벗어나지 않도록)
        const colorIdx = selectedDate ?? dateIndex;
        const safeColor = colors[colorIdx] || '#000000';
        
        return (
          <DayCard
            key={safeDateLocation.date}
            dateLocation={safeDateLocation}
            dayIndex={dayIdx}
            color={safeColor}
            onRouteClick={onRouteClick}
            onRouteMouseEnter={onRouteMouseEnter}
            onRouteMouseLeave={onRouteMouseLeave}
            onLocationMouseEnter={onLocationMouseEnter}
            onLocationMouseLeave={onLocationMouseLeave}
            onLocationClick={onLocationClick}
            isEditMode={isEditMode}
            onLocationContentChange={onLocationContentChange}
            onRouteChange={onRouteChange}
            addMarkerMode={addMarkerMode}
            setAddMarkerMode={setAddMarkerMode}
            onAddMarker={onAddMarker}
          />
        );
      })}
    </div>
  );
};

export default React.memo(Timeline);