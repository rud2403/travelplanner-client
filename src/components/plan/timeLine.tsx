'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, LocationHandlerProps, RouteHandlerProps } from '@/types/travel';

// 여행 경로 유형을 텍스트로 변환
const TRANSPORT_TYPE_MAP = {
  1: '자동차',
  2: '대중교통',
  3: '도보',
};

// 장소 유형을 텍스트로 변환
const LOCATION_TYPE_MAP = {
  1: '관광지',
  2: '식당',
  3: '숙소',
  4: '쇼핑',
};

// 아이콘 경로 맵핑
const TRANSPORT_ICON_PATHS = {
  1: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  2: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
  3: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
};

interface TimelineProps extends LocationHandlerProps, RouteHandlerProps {}

/**
 * 여행 일정 타임라인 컴포넌트
 */
const TimeLine: React.FC<TimelineProps> = ({
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  onLocationMouseEnter,
  onLocationMouseLeave,
  onLocationClick,
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
    <div className="flex overflow-x-auto space-x-6 p-4 pb-6 hide-scrollbar">
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
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
        />
      ))}
    </div>
  );
};

interface DayCardProps extends LocationHandlerProps, RouteHandlerProps {
  dateLocation: any;
  dayIndex: number;
  color: string;
}

/**
 * 일별 여행 일정 카드 컴포넌트
 */
const DayCard: React.FC<DayCardProps> = ({
  dateLocation,
  dayIndex,
  color,
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  onLocationMouseEnter,
  onLocationMouseLeave,
  onLocationClick,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl min-w-[320px] border border-gray-100 hover:border-blue-200 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-center mb-2" style={{ color }}>
          {dayIndex + 1}일차
        </h3>
        <p className="text-center text-gray-500 font-medium">{dateLocation.date}</p>
      </div>
      
      <ul className="space-y-6">
        {dateLocation.locations.map((location: TravelLocation, locIndex: number) => (
          <React.Fragment key={locIndex}>
            {/* 장소 항목 */}
            <LocationItem
              location={location}
              index={locIndex}
              color={color}
              onMouseEnter={() => onLocationMouseEnter(location)}
              onMouseLeave={onLocationMouseLeave}
              onClick={() => onLocationClick(location)}
            />
            
            {/* 이동 경로 항목 */}
            {(dateLocation.routes && dateLocation.routes[locIndex]) && (
              <RouteItem
                route={dateLocation.routes[locIndex]}
                onClick={() => onRouteClick(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                onMouseEnter={() => onRouteMouseEnter(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                onMouseLeave={onRouteMouseLeave}
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

interface LocationItemProps {
  location: TravelLocation;
  index: number;
  color: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

/**
 * 타임라인의 장소 항목 컴포넌트
 */
const LocationItem: React.FC<LocationItemProps> = ({
  location,
  index,
  color,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const locationType = location.type as keyof typeof LOCATION_TYPE_MAP;
  
  return (
    <li
      className="flex items-center space-x-4 cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 border border-transparent hover:border-blue-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold flex-shrink-0 shadow-md" 
        style={{ backgroundColor: color, aspectRatio: "1 / 1", minWidth: "3rem" }}
      >
        {index + 1}
      </div>
      <div className="flex-1">
        <span className="font-semibold text-lg block mb-1">{location.name}</span>
        <div className="flex items-center mb-1 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{location.startTime} ~ {location.endTime}</span>
        </div>
        {location.description && (
          <p className="text-sm text-gray-700 mb-2 italic">&ldquo;{location.description}&rdquo;</p>
        )}
        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
          {LOCATION_TYPE_MAP[locationType] || '기타'}
        </div>
      </div>
    </li>
  );
};

interface RouteItemProps {
  route: any;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * 타임라인의 이동 경로 항목 컴포넌트
 */
const RouteItem: React.FC<RouteItemProps> = ({
  route,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const methodType = (route.transportationType || route.method) as keyof typeof TRANSPORT_TYPE_MAP;
  
  return (
    <li className="flex items-center space-x-2 pl-16 pb-4">
      <div className="border-l-2 border-dashed h-10 -mt-2 ml-6 border-gray-300"></div>
      <div
        className="cursor-pointer ml-2 flex items-center p-2 px-4 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 shadow-sm"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {TRANSPORT_ICON_PATHS[methodType] || <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />}
        </svg>
        <span className="font-medium">{TRANSPORT_TYPE_MAP[methodType] || '이동'}</span>
        {route.time && <span className="ml-2 text-xs text-blue-500">({route.time})</span>}
      </div>
    </li>
  );
};

export default React.memo(TimeLine);