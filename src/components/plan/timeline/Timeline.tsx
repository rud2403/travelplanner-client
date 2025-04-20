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

  // 선택한 날짜가 있으면 해당 날짜만, 없으면 전체 날짜 표시
  const displayLocations = selectedDate !== null ? [dateLocations[selectedDate]] : dateLocations;

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

      {displayLocations.map((dateLocation, dateIndex) => (
        <DayCard
          key={dateLocation.date}
          dateLocation={dateLocation}
          dayIndex={selectedDate !== null ? selectedDate : dateIndex}
          color={colors[selectedDate ?? dateIndex]}
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
      ))}
    </div>
  );
};

export default React.memo(Timeline);