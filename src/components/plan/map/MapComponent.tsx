'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, Marker, Polyline, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelPlan } from '@/types/travel';
import LocationInfoCard from './LocationInfoCard';

// 지도 컨테이너 스타일
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

interface MapComponentProps {
  travelPlanData: TravelPlan[];
  onMarkerClick: (location: TravelLocation) => void;
  hoveredLocation: TravelLocation | null;
  isEditMode?: boolean;
  onMarkerChange?: () => void;
  addMarkerMode?: boolean;
  onAddMarker?: (lat: number, lng: number, eventType?: string) => void;
  tempMarkerPosition?: { lat: number, lng: number } | null;
}

/**
 * 여행 일정을 지도에 표시하는 컴포넌트
 */
const MapComponent: React.FC<MapComponentProps> = ({ 
  travelPlanData, 
  onMarkerClick, 
  hoveredLocation,
  isEditMode = false,
  onMarkerChange,
  addMarkerMode = false,
  onAddMarker,
  tempMarkerPosition
}) => {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeLocation, setActiveLocation] = useState<TravelLocation | null>(null);
  
  // Travel Store에서 필요한 상태 가져오기
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);
  const selectedDate = useTravelStore((state) => state.selectedDate);
  const colors = useTravelStore((state) => state.colors);
  const setDateLocations = useTravelStore((state) => state.setDateLocations);
  const dateLocations = useTravelStore((state) => state.dateLocations);
  
  // Google Maps API 로드
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // 데이터 유효성 검사
  useEffect(() => {
    if ((!travelPlanData || travelPlanData.length === 0)) {
      router.push('/');
    }
  }, [travelPlanData, router]);

  // 마커 추가 모드 변경 감지 및 인포창 초기화
  useEffect(() => {
    if (addMarkerMode === true) {
      // 마커 추가 모드 시작 시 항상 인포창 클리어
      console.log('마커 추가 모드 활성화: 인포창 제거');
      setActiveLocation(null);
    }
  }, [addMarkerMode]);
  
  // 임시 마커 위치가 변경될 때도 인포창 제거
  useEffect(() => {
    if (addMarkerMode && tempMarkerPosition) {
      setActiveLocation(null);
    }
  }, [addMarkerMode, tempMarkerPosition]);

  // 포커스된 위치로 지도 이동 (마커 추가 모드가 아닐 때만)
  useEffect(() => {
    // 마커 추가 모드 상태 체크
    if (addMarkerMode) {
      return; // 마커 추가 모드에서는 아무 것도 하지 않음
    }
    
    // 일반 모드에서만 지도 포커싱 및 인포창 표시
    if (focusedLocation && mapRef.current) {
      mapRef.current.panTo({ lat: focusedLocation.lat, lng: focusedLocation.lng });
      mapRef.current.setZoom(15);
      setActiveLocation(focusedLocation); // 인포윈도우 표시
    }
  }, [focusedLocation, addMarkerMode]);

  // 로딩 중 표시
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  /**
   * 마커 아이콘 생성
   */
  const createCustomMarkerIcon = (color: string, location: TravelLocation, index: number) => {
    const isHovered = hoveredLocation === location;
    const isFocused = focusedLocation === location;
    const isActive = activeLocation === location;
    
    // 마커 크기 결정 - 마우스 오버, 포커스, 활성화 상태에 따라 크기 변경
    const scale = isFocused || isHovered || isActive ? 14 : 10;
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: scale,
      labelOrigin: new google.maps.Point(0, 0),
    };
  };
  
  /**
   * 마커 라벨 생성
   */
  const createCustomLabel = (label: string) => ({
    text: label,
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 'bold',
  });
  
  /**
   * 마커 클릭 이벤트 처리
   */
  const handleMarkerClick = (location: TravelLocation) => {
    // 여행일정 수정에서도 기존 마커 클릭시 인포창이 표시되도록 수정
    // 같은 마커를 다시 클릭하면 인포윈도우 토글
    setActiveLocation(prev => prev === location ? null : location);
    onMarkerClick(location);
  };

  /**
   * 인포윈도우 닫기 핸들러
   */
  const handleInfoWindowClose = () => {
    setActiveLocation(null);
  };

  /**
   * 지도 클릭 이벤트 핸들러
   */
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    // 마커 추가 모드일 때는 항상 인포창 제거
    setActiveLocation(null);
    
    // 마커 추가 모드에서만 처리
    if (addMarkerMode && onAddMarker) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      console.log('지도 클릭 - 위치 선택됨:', lat, lng);
            
      // 위치 정보를 전역 상태에 저장 (타임라인에서 사용)
      useTravelStore.setState({
        focusedLocation: {
          lat: lat,
          lng: lng,
          name: "",
          type: 1,
          startTime: "",
          endTime: ""
        }
      });
      
      // 콜백 함수 호출
      onAddMarker(lat, lng, 'click');
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg h-full">
      {/* 마커 추가 모드일 때 안내 메시지 */}
      {addMarkerMode && (
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            지도에서 마커를 추가할 위치를 클릭하세요
          </div>
        </div>
      )}
      <GoogleMap
        key={selectedDate}
        mapContainerStyle={containerStyle}
        center={travelPlanData[0]?.locations[0] || { lat: 37.5665, lng: 126.9780 }} // 서울 중심부 기본 좌표
        zoom={14}
        onLoad={(map) => { mapRef.current = map; }}
        onClick={handleMapClick}
        options={{
          scrollwheel: true,
          zoomControl: !addMarkerMode, // 마커 추가 모드에서는 줌 컨트롤 감추기
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: !addMarkerMode, // 마커 추가 모드에서는 전체화면 버튼 감추기
          draggableCursor: addMarkerMode ? 'crosshair' : 'default',
          clickableIcons: false, // 중요: POI 클릭 비활성화
          disableDoubleClickZoom: true, // 더블클릭 줌 비활성화
          styles: [
            // 모든 POI 요소 숨기기
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            // 모든 도로 아이콘 숨기기
            { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            // 대중교통 아이콘 숨기기
            { featureType: "transit", stylers: [{ visibility: "off" }] }
          ]
        }}
      >
        {travelPlanData.map((dateLocation) => {
          if (!dateLocation || !dateLocation.locations || !dateLocation.routes) {
            return null;
          }

          const color = colors[dateLocation.tripIndex];
          return (
            <React.Fragment key={dateLocation.date}>
              {/* 여행 경로 라인 먼저 렌더링 */}
              {dateLocation.routes.map((route, index) => {
                const fromLocation = dateLocation.locations.find(loc => loc.name === route.fromLocation);
                const toLocation = dateLocation.locations.find(loc => loc.name === route.toLocation);

                if (fromLocation && toLocation) {
                  const pathArray = [fromLocation, toLocation];
                  const isHighlighted = focusedRoute === route;

                  return (
                    <Polyline
                      key={`${route.fromLocation}-${route.toLocation}-${selectedDate}`}
                      path={pathArray}
                      options={{
                        strokeColor: isHighlighted ? '#FFFF00' : color,
                        strokeOpacity: 0.8,
                        strokeWeight: isHighlighted ? 5 : 3,
                        icons: [{
                          icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 2,
                            fillColor: isHighlighted ? '#FFFF00' : color,
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: '#FFFFFF',
                          },
                          offset: '50%',
                          repeat: '200px'
                        }]
                      }}
                    />
                  );
                }
                return null;
              })}
              
              {/* 마커 렌더링 */}
              {dateLocation.locations.map((location, index) => (
                <Marker
                  key={`${location.name}-${index}`}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={createCustomMarkerIcon(color, location, index)}
                  label={createCustomLabel((index + 1).toString())}
                  onClick={() => handleMarkerClick(location)}
                  zIndex={activeLocation === location ? 1000 : 100}
                  draggable={isEditMode}
                  onDragEnd={(e) => {
                    if (isEditMode && e.latLng) {
                      // 위치 변경 처리
                      const newLat = e.latLng.lat();
                      const newLng = e.latLng.lng();
                      
                      // 데이터 복사 및 위치 업데이트
                      const updatedDateLocations = [...dateLocations];
                      const dayIndex = dateLocation.tripIndex;
                      
                      // 정확히 같은 위치의 마커를 찾기
                      const locationIndex = updatedDateLocations[dayIndex].locations.findIndex(
                        loc => loc === location // 동일한 객체 참조인지 확인
                      );
                      
                      if (locationIndex !== -1) {
                        // 변경된 위치 값 업데이트
                        updatedDateLocations[dayIndex].locations[locationIndex] = {
                          ...updatedDateLocations[dayIndex].locations[locationIndex],
                          lat: newLat,
                          lng: newLng,
                          isModified: true // 수정되었음을 표시
                        };
                        
                        // Zustand 스토어 업데이트
                        setDateLocations(updatedDateLocations);
                        
                        // 변경 함수 호출
                        if (onMarkerChange) {
                          onMarkerChange();
                        }
                      }
                    }
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}

        {/* 임시 마커 (위치 선택 모드에서만 표시) 또는 선택된 마커 */}
        {tempMarkerPosition && (
          <Marker
            position={tempMarkerPosition}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: addMarkerMode ? '#FF0000' : '#4CAF50',  // 마커 추가 모드일 때는 빨간색, 아닐 때는 초록색
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: addMarkerMode ? 8 : 10,  // 마커 추가 모드가 아닐 때는 조금 더 크게
            }}
            zIndex={1000}  // 다른 마커보다 상위에 표시
          />
        )}

        {/* 활성화된 위치에 인포윈도우 표시 */}
        {activeLocation && (
          <InfoWindow
            position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new google.maps.Size(0, -10),
              maxWidth: 320,
              disableAutoPan: false
            }}
          >
            <LocationInfoCard location={activeLocation} />
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapComponent);