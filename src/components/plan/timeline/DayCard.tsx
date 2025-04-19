'use client';

import React, { useEffect, useState } from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { LocationHandlerProps, RouteHandlerProps, TravelLocation, TravelRoute } from '@/types/travel';
import LocationItem from '../location/LocationItem';
import RouteItem from '../route/RouteItem';
import { LOCATION_TYPE_MAP } from '../common/constants';

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

export default DayCard;