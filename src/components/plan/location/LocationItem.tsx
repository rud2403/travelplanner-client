'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TravelLocation } from '@/types/travel';
import { LOCATION_TYPE_MAP } from '../common/constants';

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
            onClick={(e) => {
              e.stopPropagation(); // 버블링 방지
              setIsEditing(true);
            }}
            className="text-sm text-blue-500 hover:text-blue-700 mb-2"
          >
            여행 내용 수정하기
          </button>
        )}

        {/* 편집 화면 */}
        {isEditing && (
          <div className="mt-2 mb-3 w-full" onClick={(e) => e.stopPropagation()}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md"
              >
                취소
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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

export default LocationItem;