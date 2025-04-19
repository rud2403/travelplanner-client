'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, LocationHandlerProps, RouteHandlerProps, TravelRoute } from '@/types/travel';

// 여행 유형 마핑
const LOCATION_TYPE_MAP = {
  1: '관광지',
  2: '식당',
  3: '숙소',
  4: '쇼핑',
};

// 이동 방법 마핑
const TRANSPORT_TYPE_MAP = {
  1: '자동차',
  2: '대중교통',
  3: '도보',
};

// 아이콘 경로 맵핑
const TRANSPORT_ICON_PATHS = {
  1: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  2: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
  3: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
};

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
const TimeLine: React.FC<TimelineProps> = ({
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

interface DayCardProps extends LocationHandlerProps, RouteHandlerProps {
  dateLocation: any;
  dayIndex: number;
  color: string;
  isEditMode?: boolean;
  onLocationContentChange?: (location: TravelLocation) => void;
  onRouteChange?: (route: any, dayIndex: number, routeIndex: number) => void;
  addMarkerMode?: boolean;
  setAddMarkerMode?: (mode: boolean) => void;
  onAddMarker?: (lat: number, lng: number, eventType: any) => void;
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
  isEditMode = false,
  onLocationContentChange,
  onRouteChange,
  addMarkerMode = false,
  setAddMarkerMode,
  onAddMarker
}) => {
  // 새 장소 추가를 위한 상태
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  // 새 장소 정보를 위한 상태
  const [newLocation, setNewLocation] = useState<Partial<TravelLocation>>({});
  const { setDateLocations, dateLocations } = useTravelStore();
  
  // 마커 추가 모드가 끝나면 위치 정보 업데이트
  useEffect(() => {
    // 마커 추가 모드가 false로 변할 때만 체크
    if (addMarkerMode === false) {
      // 전역 상태에서 위치 가져오기
      const markerLocation = useTravelStore.getState().focusedLocation;
      
      console.log('위치 가져오기 시도:', markerLocation);
      
      // 선택된 위치가 있을 경우에만 위경도 정보 업데이트
      if (markerLocation && markerLocation.lat && markerLocation.lng) {
        console.log('위치 가져오기 성공:', markerLocation.lat, markerLocation.lng);
        
        // 새 위치 정보 설정
        setNewLocation(prev => ({
          ...prev,
          lat: markerLocation.lat,
          lng: markerLocation.lng
        }));
      }
    }
  }, [addMarkerMode]);
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
              isEditMode={isEditMode}
              onContentChange={onLocationContentChange}
            />

            {/* 이동 경로 항목 */}
            {(dateLocation.routes && dateLocation.routes[locIndex]) && (
              <RouteItem
                route={dateLocation.routes[locIndex]}
                onClick={() => onRouteClick(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                onMouseEnter={() => onRouteMouseEnter(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                onMouseLeave={onRouteMouseLeave}
                isEditMode={isEditMode}
                onRouteChange={onRouteChange}
                dayIndex={dayIndex}
                routeIndex={locIndex}
              />
            )}
          </React.Fragment>
        ))}
        
        {/* 여행 계획 추가 버튼 및 폼 */}
        {isEditMode && (
          <li className="p-4 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-300">
            {!isAddingLocation ? (
              <button
                onClick={() => setIsAddingLocation(true)}
                className="w-full py-3 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                새 여행 계획 추가하기
              </button>
            ) : (
              <div className="p-3">
                <h3 className="text-lg font-bold text-gray-700 mb-3">새 여행 계획 추가</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소명</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newLocation.name || ''}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="장소명을 입력하세요"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newLocation.startTime || ''}
                        onChange={(e) => setNewLocation({...newLocation, startTime: e.target.value})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newLocation.endTime || ''}
                        onChange={(e) => setNewLocation({...newLocation, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                    <div className="flex space-x-2">
                      {newLocation.lat && newLocation.lng ? (
                        <div className="flex-1 flex items-center border border-green-200 bg-green-50 p-2 rounded-md text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-800">
                            위치 선택 완료 (위도: {newLocation.lat?.toFixed(4)}, 경도: {newLocation.lng?.toFixed(4)})
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 bg-gray-50 p-2 border border-gray-200 rounded-md text-sm text-gray-500">
                          아직 위치가 선택되지 않았습니다
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          // 사용자가 이미 위치를 선택했다면 초기화
                          setNewLocation({});
                          
                          // 마커 추가 모드 활성화
                          if (onAddMarker && setAddMarkerMode) {
                            console.log('간단한 방식: 마커 추가 모드 시작');
                            setAddMarkerMode(true);
                            onAddMarker(0, 0, 'button');
                          }
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        맵에서 선택
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소 유형</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newLocation.type || 1}
                      onChange={(e) => setNewLocation({...newLocation, type: parseInt(e.target.value)})}
                    >
                      {Object.entries(LOCATION_TYPE_MAP).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newLocation.description || ''}
                      onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                      placeholder="장소에 대한 설명을 입력하세요"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => {
                        setIsAddingLocation(false);
                        setNewLocation({});
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        // 필수 필드 검증
                        if (!newLocation.name || !newLocation.startTime || !newLocation.endTime || 
                            newLocation.lat === undefined || newLocation.lng === undefined) {
                          alert('모든 필수 항목을 입력해주세요');
                          return;
                        }
                        
                        // 새 여행 계획 추가 처리
                        const updatedDateLocations = [...dateLocations];
                        const newFullLocation: TravelLocation = {
                          name: newLocation.name || '',
                          lat: newLocation.lat || 0,
                          lng: newLocation.lng || 0,
                          type: newLocation.type || 1,
                          description: newLocation.description || '',
                          startTime: newLocation.startTime || '09:00',
                          endTime: newLocation.endTime || '10:00',
                          isModified: true
                        };
                        
                        // 로케이션 추가
                        updatedDateLocations[dayIndex].locations.push(newFullLocation);
                        
                        // 이전 장소가 있으면 경로 추가
                        if (updatedDateLocations[dayIndex].locations.length > 1) {
                          const prevLocation = updatedDateLocations[dayIndex].locations[updatedDateLocations[dayIndex].locations.length - 2];
                          
                          // 새 경로 생성
                          const newRoute: TravelRoute = {
                            fromLocation: prevLocation.name,
                            toLocation: newFullLocation.name,
                            transportationType: 1, // 기본 이동수단 (자동차)
                            method: 1,
                            time: '30' // 기본 30분
                          };
                          
                          // 경로 추가
                          updatedDateLocations[dayIndex].routes.push(newRoute);
                        }
                        
                        // 저장
                        setDateLocations(updatedDateLocations);
                        setIsAddingLocation(false);
                        setNewLocation({});
                        
                        // 포커스된 위치 초기화 (임시 마커 제거)
                        useTravelStore.setState({ focusedLocation: null });
                        
                        // 마커 추가 모드 비활성화
                        if (setAddMarkerMode) {
                          setAddMarkerMode(false);
                        }
                        
                        // planning.tsx의 selectedMarkerPosition도 초기화해야 하지만
                        // 직접 접근할 수 없으므로 window 객체 통해 이벤트 발생
                        const event = new CustomEvent('clearSelectedMarker');
                        window.dispatchEvent(event);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      추가하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        )}
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
  isEditMode?: boolean;
  onContentChange?: (location: TravelLocation) => void;
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
  isEditMode = false,
  onContentChange
}) => {
  const locationType = location.type as keyof typeof LOCATION_TYPE_MAP;
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(location.description || '');
  const [locationName, setLocationName] = useState(location.name);
  const [startTime, setStartTime] = useState(location.startTime);
  const [endTime, setEndTime] = useState(location.endTime);
  const [locType, setLocType] = useState(location.type);

  const locationRef = useRef(location);

  // 위치 정보가 변경되면 상태 업데이트
  useEffect(() => {
    // 오직 location이 변경되고 편집 중이 아닐 경우에만 업데이트
    if (!isEditing) {
      setLocationName(location.name);
      setStartTime(location.startTime);
      setEndTime(location.endTime);
      setDescription(location.description || '');
      setLocType(location.type);
      locationRef.current = location;
    }
  }, [location, isEditing]);

  // 내용을 수정하고 isEditing이 변경되면 상태 갱신
  useEffect(() => {
    // 편집 시작시 상태 초기화
    if (isEditing) {
      setLocationName(location.name);
      setStartTime(location.startTime);
      setEndTime(location.endTime);
      setDescription(location.description || '');
      setLocType(location.type);
    }
  }, [isEditing, location]);
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

        {!isEditing && (
          <div className="flex items-center">
            {location.isModified && (
              <span className="mr-2 text-amber-500 font-bold text-sm">★</span>
            )}
            <span className="font-semibold text-lg block mb-1">{location.name}</span>
          </div>
        )}

        {!isEditing && (
          <div className="flex items-center mb-1 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{location.startTime} ~ {location.endTime}</span>
          </div>
        )}

        {location.description && !isEditing && (
          <p className="text-sm text-gray-700 mb-2 italic">&ldquo;{location.description}&rdquo;</p>
        )}

        {!isEditing && (
          <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {LOCATION_TYPE_MAP[locationType] || '기타'}
          </div>
        )}

        {/* 편집 모드일 경우 여행 내용 편집 기능 표시 */}
        {isEditMode && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-500 hover:text-blue-700 mb-2"
          >
            여행 내용 수정하기
          </button>
        )}

        {/* 편집 화면 */}
        {isEditing && (
          <div className="mt-2 mb-3 w-full">
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">여행지명</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="여행지명을 입력해주세요"
              />
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">장소 유형</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={locType}
                onChange={(e) => setLocType(Number(e.target.value))}
              >
                {Object.entries(LOCATION_TYPE_MAP).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div className="mb-2 flex items-center space-x-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">시작 시간</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">종료 시간</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">여행 내용</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="여행 내용을 작성해주세요"
                rows={3}
              />
            </div>

            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (onContentChange) {
                    // 수정된 내용으로 업데이트하고 isModified 플래그 제거
                    onContentChange({
                      ...location,
                      name: locationName,
                      startTime: startTime,
                      endTime: endTime,
                      description: description,
                      type: locType
                      // isModified 플래그를 유지하여 변경사항이 있었음을 계속 표시
                    });
                  }
                  setIsEditing(false);
                }}
                className="px-2 py-1 text-xs text-white bg-blue-500 rounded-md"
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

interface RouteItemProps {
  route: any;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isEditMode?: boolean;
  onRouteChange?: (route: any, dayIndex: any, routeIndex: any) => void;
  dayIndex: number;
  routeIndex: number;
}

/**
 * 타임라인의 이동 경로 항목 컴포넌트
 */
const RouteItem: React.FC<RouteItemProps> = ({
  route,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isEditMode = false,
  onRouteChange,
  dayIndex,
  routeIndex
}) => {
  const methodType = (route.transportationType || route.method) as keyof typeof TRANSPORT_TYPE_MAP;
  const [isEditing, setIsEditing] = useState(false);
  const [transportType, setTransportType] = useState<number>(route.transportationType || route.method || 1);
  const [transportMinutes, setTransportMinutes] = useState<number>(
    (() => {
      if (route.time) {
        try {
          return route.time;
        } catch (e) {
          return 0; // 오류 발생 시 0분으로 기본 설정
        }
      }
      return 0; // 시간 없으면 0분으로 기본 설정
    })()
  );

  // 편집 시작 시 상태 초기화
  useEffect(() => {
    if (isEditing) {
      setTransportType(route.transportationType || route.method || 1);
      // 시간 형식에서 분 단위로 변환
      if (route.time) {
        try {
          setTransportMinutes(route.time); // 0분은 허용하지 않음
        } catch (e) {
          // 시간 형식이 잘못된 경우 기본값 0분 사용
          setTransportMinutes(0);
        }
      } else {
        setTransportMinutes(0); // 기본값 0분
      }
    }
  }, [isEditing, route]);

  // 경로 변경 함수
  const handleSaveRouteChanges = () => {
    if (onRouteChange) {
      const updatedRoute = {
        ...route,
        transportationType: transportType,
        method: transportType, // 이전 속성과의 호환성을 위해 양쪽 다 업데이트
        time: transportMinutes
      };
      onRouteChange(updatedRoute, dayIndex, routeIndex);
    }
    setIsEditing(false);
  };

  return (
    <li className="flex items-center space-x-2 pl-16 pb-4">
      <div className="border-l-2 border-dashed h-10 -mt-2 ml-6 border-gray-300"></div>
      {!isEditing ? (
        <div className="flex items-center">
          <div
            className="cursor-pointer ml-2 flex items-center p-2 px-4 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 shadow-sm"
            onClick={isEditMode ? () => setIsEditing(true) : onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {TRANSPORT_ICON_PATHS[methodType] || <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />}
            </svg>
            <span className="font-medium">{TRANSPORT_TYPE_MAP[methodType] || '이동'}</span>
            {route.time && (
              <span className="ml-2 text-xs text-blue-500">
                {(() => {
                  try {
                    // 시간을 분 단위로 변환
                    return `(${transportMinutes}분)`;
                  } catch (e) {
                    // 시간 형식이 잘못된 경우 기본값 사용
                    return '(error)';
                  }
                })()}
              </span>
            )}
          </div>
          {isEditMode && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 text-xs text-blue-500 hover:text-blue-700"
            >
              이동 방법 수정
            </button>
          )}
        </div>
      ) : (
        <div className="ml-2 p-3 bg-blue-50 rounded-lg shadow-sm w-full">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">이동 방법</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={transportType}
                onChange={(e) => setTransportType(Number(e.target.value))}
              >
                {Object.entries(TRANSPORT_TYPE_MAP).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">소요 시간(분)</label>
              <div className="flex items-center">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={transportMinutes}
                  onChange={(e) => setTransportMinutes(parseInt(e.target.value) || 0)}
                />
                <span className="ml-2 text-xs text-gray-500">분</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                // 편집 모드 종료
                setIsEditing(false);
                // 원래 값으로 되돌리기 (취소)
                if (route.time) {
                  try {
                    setTransportMinutes(route.time || 0);
                  } catch (e) {
                    setTransportMinutes(route.time);
                  }
                } else {
                  setTransportMinutes(route.time);
                }
                setTransportType(route.transportationType || route.method || 1);
              }}
              className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md"
            >
              취소
            </button>
            <button
              onClick={handleSaveRouteChanges}
              className="px-2 py-1 text-xs text-white bg-blue-500 rounded-md"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default React.memo(TimeLine);