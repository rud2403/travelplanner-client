'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TravelLocation } from '@/types/travel';
import { LOCATION_TYPE_STYLES } from '../common/constants';

/**
 * 위치 정보 카드 컴포넌트
 */
interface LocationInfoCardProps {
  location: TravelLocation;
}

const LocationInfoCard: React.FC<LocationInfoCardProps> = ({ location }) => {
  const locationType = location.type as keyof typeof LOCATION_TYPE_STYLES.backgroundColor;
  const bgColor = LOCATION_TYPE_STYLES.backgroundColor[locationType] || '#F3F4F6';
  const textColor = LOCATION_TYPE_STYLES.textColor[locationType] || '#374151';
  const label = LOCATION_TYPE_STYLES.label[locationType] || '기타';
  
  // useRef를 사용하여 변경된 위치 정보를 추적
  const prevLocationRef = useRef(location);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  
  // 위치 정보가 변경되었는지 확인
  useEffect(() => {
    // 현재 값과 이전 값이 다르면 업데이트 필요
    prevLocationRef.current = location;
    setShouldUpdate(!shouldUpdate); // 강제 렌더링을 위한 토글
  }, [location]);

  return (
    <div className="p-4 max-w-xs bg-white rounded-lg shadow-inner">
      <div className="flex items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center">
            {location.isModified && (
              <span className="mr-2 text-amber-500 font-bold text-sm">★</span>
            )}
            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{location.name}</h3>
          </div>
          <div className="flex items-center text-xs font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {location.startTime} ~ {location.endTime}
          </div>
        </div>
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" 
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {label}
        </span>
      </div>

      {location.description && (
        <div className="mt-2 mb-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{location.description}&rdquo;</p>
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank')}
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
  );
};

export default LocationInfoCard;