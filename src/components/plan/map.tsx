import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, Marker, Polyline, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelPlan } from '@/data/travelPlanData';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

// Google Maps 맵 스타일 옵션
const mapOptions = {
  scrollwheel: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

interface MapComponentProps {
  travelPlanData: TravelPlan[];
  onMarkerClick: (location: TravelLocation) => void;
  hoveredLocation: TravelLocation | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ travelPlanData, onMarkerClick, hoveredLocation }) => {
  const router = useRouter();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeLocation, setActiveLocation] = useState<TravelLocation | null>(null);
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);
  const selectedDate = useTravelStore((state) => state.selectedDate);
  const colors = useTravelStore((state) => state.colors);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // 데이터 유효성 검사
  useEffect(() => {
    if ((!travelPlanData || travelPlanData.length === 0)) {
      router.push('/');
    }
  }, [travelPlanData, router]);

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.panTo({ lat: focusedLocation.lat, lng: focusedLocation.lng });
      mapRef.current.setZoom(15);
      setActiveLocation(focusedLocation); // 포커스된 위치에 인포윈도우 표시
    }
  }, [focusedLocation]);

  // 호버 상태에 따른 효과 관리 (마우스 오버시 팝업 표시하지 않음)
  // useEffect(() => {
  //   if (hoveredLocation) {
  //     setActiveLocation(hoveredLocation);
  //   }
  // }, [hoveredLocation]);

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-blue-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-blue-100 rounded"></div>
      </div>
    </div>;
  }

  const createCustomMarkerIcon = (color: string, location: TravelLocation, index: number) => {
    const isHovered = hoveredLocation === location;
    const isFocused = focusedLocation === location;
    const isActive = activeLocation === location;
    
    // 마커 크기 결정
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
  
  // 마커 라벨 생성
  const createCustomLabel = (label: string) => ({
    text: label,
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 'bold',
  });
  
  // 마커 클릭 이벤트 처리
  const handleMarkerClick = (location: TravelLocation) => {
    // 같은 마커를 다시 클릭하면 인포윈도우 토글
    setActiveLocation(prev => prev === location ? null : location);
    onMarkerClick(location);
  };

  const handleInfoWindowClose = () => {
    setActiveLocation(null);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    // 지도의 다른 영역 클릭시 인포윈도우 닫기
    if (!e.latLng) { // 마커가 아닌 영역 클릭
      setActiveLocation(null);
    }
  };

  const handleLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg h-full">
      <GoogleMap
        key={selectedDate}
        mapContainerStyle={containerStyle}
        center={travelPlanData[0]?.locations[0] || { lat: 37.5665, lng: 126.9780 }} // 서울 중심부 기본 좌표
        zoom={14}
        onLoad={handleLoad}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {travelPlanData.map((dateLocation, dateIndex) => {
          if (!dateLocation || !dateLocation.locations || !dateLocation.routes) {
            return null;
          }

          const color = colors[dateLocation.tripIndex];
          return (
            <React.Fragment key={dateLocation.date}>
              {/* 여행 경로 라인 먼저 렌더링 */}
              {dateLocation.routes && dateLocation.routes.length > 0 && dateLocation.routes.map((route, index) => {
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
                />
              ))}
            </React.Fragment>
          );
        })}

        {/* 활성화된 위치에 인포윈도우 표시 */}
        {activeLocation && (
          <InfoWindow
            position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new google.maps.Size(0, -10),
              maxWidth: 320,
            }}
          >
            <div className="p-4 max-w-xs bg-white rounded-lg shadow-inner">
              <div className="flex items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{activeLocation.name}</h3>
                  <div className="flex items-center text-xs font-medium text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activeLocation.startTime} ~ {activeLocation.endTime}
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" 
                  style={{
                    backgroundColor: {
                      1: '#EBF5FF', // 관광지 - 한국어로 변경
                      2: '#FEF3C7', // 식당
                      3: '#DCFCE7', // 숙소
                      4: '#F3E8FF', // 쇼핑
                    }[activeLocation.type] || '#F3F4F6',
                    color: {
                      1: '#1E40AF', // 관광지
                      2: '#92400E', // 식당
                      3: '#166534', // 숙소
                      4: '#6B21A8', // 쇼핑
                    }[activeLocation.type] || '#374151'
                  }}>
                  {{
                    1: '관광지',
                    2: '식당',
                    3: '숙소',
                    4: '쇼핑',
                  }[activeLocation.type] || '기타'}
                </span>
              </div>

              {activeLocation.description && (
                <div className="mt-2 mb-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{activeLocation.description}&rdquo;</p>
                </div>
              )}
              
              <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${activeLocation.lat},${activeLocation.lng}`, '_blank')}
                  className="text-xs flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Google Maps에서 보기
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapComponent);