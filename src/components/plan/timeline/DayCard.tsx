'use client';

import React, { useEffect, useState } from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { LocationHandlerProps, RouteHandlerProps, TravelLocation, TravelRoute } from '@/types/travel';
import LocationItem from '../location/LocationItem';
import RouteItem from '../route/RouteItem';
import { LOCATION_TYPE_MAP, LOCATION_TYPE_STYLES } from '../common/constants';
import { addLocationUpdateListener, LocationUpdateEvent } from '../event/LocationEvents';

interface DayCardProps extends LocationHandlerProps, RouteHandlerProps {
  dateLocation: any;
  dayIndex: number;
  color: string;
  isEditMode?: boolean;
  onLocationContentChange?: (location: TravelLocation) => void;
  onRouteChange?: (route: TravelRoute, dayIndex: number, routeIndex: number) => void;
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
  
  // 위치 업데이트 이벤트 구독
  useEffect(() => {
    // 위치 업데이트 이벤트 핸들러
    const handleLocationUpdate = (event: CustomEvent<LocationUpdateEvent>) => {
      const { lat, lng, selectedDate } = event.detail;
      
      // 현재 일차에 해당하는 경우에만 처리
      if (selectedDate === null || selectedDate === dayIndex) {
        // 새 위치 정보 설정
        setNewLocation(prev => ({
          ...prev,
          lat,
          lng
        }));
        
        // 입력 폼 활성화
        if (!isAddingLocation) {
          setIsAddingLocation(true);
        }
      }
    };
    
    // 이벤트 리스너 등록
    const cleanup = addLocationUpdateListener(handleLocationUpdate);
    
    // 구독 해제
    return cleanup;
  }, [dayIndex, isAddingLocation]);
  
  // 컴포넌트 마운트/언마운트 시 임시 위치 정보 초기화
  useEffect(() => {
    // 새 위치 정보 초기화
    setNewLocation({});
    
    // 전역 상태의 임시 위치 정보도 초기화
    useTravelStore.getState().resetLocationState();
    
    // 컴포넌트 언마운트 시 임시 위치 정보 초기화
    return () => {
      // 전역 상태의 임시 위치 정보 초기화
      useTravelStore.getState().resetLocationState();
    };
  }, []);
  
  // 수정 모드 변경 및 마커 추가 모드가 끝나면 위치 정보 업데이트
  useEffect(() => {
    // 1. 수정 모드가 비활성화될 때는 반드시 새 위치 정보 초기화
    if (!isEditMode) {
      setIsAddingLocation(false);
      setNewLocation({});
      return;
    }
    
    // 2. 수정 모드가 활성화될 때도 새 위치 정보 초기화 (수정 모드 진입 시)
    if (isEditMode) {
      setNewLocation({});
    }
  }, [isEditMode]);
  
  // 마커 추가 모드가 끝나면 위치 정보 업데이트
  useEffect(() => {
    // 마커 추가 모드가 false로 변할 때만 체크
    if (addMarkerMode === false) {
      // 전역 상태에서 위치 가져오기 - tempSelectedLocation 사용
      const markerLocation = useTravelStore.getState().tempSelectedLocation;
      
      // 선택된 위치가 있을 경우에만 위경도 정보 업데이트
      if (markerLocation && markerLocation.lat && markerLocation.lng) {
        // 새 위치 정보 설정 - 기존 정보 유지하면서 위경도만 업데이트
        setNewLocation(prev => ({
          ...prev,
          lat: markerLocation.lat,
          lng: markerLocation.lng
        }));
        
        // isAddingLocation을 true로 설정하여 입력 폼 표시
        if (!isAddingLocation) {
          setIsAddingLocation(true);
        }
      }
    }
  }, [addMarkerMode, isAddingLocation]);
  
  // 전역 tempSelectedLocation 변경을 감지하여 위치 정보 업데이트
  // 무한 루프 방지를 위해 구독 제거
  useEffect(() => {
    // 임시 위치 변경 감지는 이제 이벤트 시스템을 통해 수행
    return () => {};
  }, [dayIndex]);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl min-w-[320px] max-h-[calc(100vh-200px)] flex flex-col border border-gray-100 hover:border-blue-200 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-center mb-2" style={{ color }}>
          {dayIndex + 1}일차
        </h3>
        <p className="text-center text-gray-500 font-medium">{dateLocation.date}</p>
      </div>

      <ul className="space-y-6 overflow-y-auto flex-1 pr-2">
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
              <div className="p-2">
                <h3 className="text-sm font-bold text-gray-700 mb-2">새 여행 계획 추가</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">장소명</label>
                    <input
                      type="text"
                      className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                      value={newLocation.name || ''}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="장소명을 입력하세요"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">시작 시간</label>
                      <input
                        type="time"
                        className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                        value={newLocation.startTime || ''}
                        onChange={(e) => setNewLocation({...newLocation, startTime: e.target.value})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">종료 시간</label>
                      <input
                        type="time"
                        className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                        value={newLocation.endTime || ''}
                        onChange={(e) => setNewLocation({...newLocation, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">위치</label>
                    <div className="flex space-x-1">
                      {newLocation.lat && newLocation.lng ? (
                        <div className="flex-1 flex items-center border border-green-200 bg-green-50 p-1.5 rounded-md text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-800 text-xs">
                            위치 선택 완료 ({newLocation.lat?.toFixed(4)}, {newLocation.lng?.toFixed(4)})
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 bg-gray-50 p-1.5 border border-gray-200 rounded-md text-xs text-gray-500">
                          아직 위치가 선택되지 않았습니다
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          // 사용자가 이미 위치를 선택했다면 초기화
                          setNewLocation({});
                          
                          // 전역 상태의 임시 위치 정보도 확실히 초기화
                          useTravelStore.getState().resetLocationState();
                          
                          // 마커 추가 모드 활성화
                          if (onAddMarker && setAddMarkerMode) {
                            console.log('마커 추가 모드 시작 - DayCard');
                            setAddMarkerMode(true);
                            onAddMarker(0, 0, 'button');
                          }
                        }}
                        className="px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        맵에서 선택
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">장소 유형</label>
                    <select
                      className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                      value={newLocation.type || 1}
                      onChange={(e) => setNewLocation({...newLocation, type: parseInt(e.target.value)})}
                    >
                      {Object.entries(LOCATION_TYPE_MAP).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">설명</label>
                    <textarea
                      className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                      value={newLocation.description || ''}
                      onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                      placeholder="장소에 대한 설명을 입력하세요"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      onClick={() => {
                        setIsAddingLocation(false);
                        setNewLocation({});
                        
                        // 임시 위치 정보 초기화
                        useTravelStore.getState().resetLocationState();
                      }}
                      className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
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
                        
                        // selectedDate 복원 (마커 이동 시 일차 정보 초기화 방지)
                        const currentSelectedDate = useTravelStore.getState().selectedDate;
                        if (currentSelectedDate !== null) {
                          setTimeout(() => {
                            useTravelStore.getState().setSelectedDate(currentSelectedDate);
                          }, 0);
                        }
                        setIsAddingLocation(false);
                        
                        // 새 위치 정보 초기화
                        setNewLocation({});
                        
                        // 포커스된 위치와 임시 위치 초기화 - 개선된 초기화 함수 사용
                        useTravelStore.getState().resetLocationState();
                        console.log('임시 위치 정보 초기화 완료 - 추가하기 버튼');
                        
                        // 마커 추가 모드 비활성화
                        if (setAddMarkerMode) {
                          setAddMarkerMode(false);
                        }
                        
                        // planning.tsx의 selectedMarkerPosition도 초기화해야 하지만
                        // 직접 접근할 수 없으므로 window 객체 통해 이벤트 발생
                        const event = new CustomEvent('clearSelectedMarker');
                        window.dispatchEvent(event);
                      }}
                      className="px-2 py-1 text-xs text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      추가
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

export default DayCard;