'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TravelLocation } from '@/types/travel';
import { LOCATION_TYPE_MAP, LOCATION_TYPE_STYLES } from '../common/constants';
import { useTravelStore } from '@/store/useTravelStore';

interface LocationItemProps {
  location: TravelLocation;
  index: number;
  color: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  isEditMode?: boolean;
  onContentChange?: (location: TravelLocation) => void;
  onDelete?: (location: TravelLocation) => void; // 여행지 삭제 함수 추가
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
  onContentChange,
  onDelete
}) => {
  const locationType = location.type as keyof typeof LOCATION_TYPE_MAP;
  const bgColor = LOCATION_TYPE_STYLES.backgroundColor[locationType] || '#F3F4F6';
  const textColor = LOCATION_TYPE_STYLES.textColor[locationType] || '#374151';
  const label = LOCATION_TYPE_STYLES.label[locationType] || '기타';
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
  
  // 수정 모드(isEditMode)가 변경될 때 isEditing 초기화
  useEffect(() => {
    // 수정 모드가 비활성화되면 편집 모드도 끄기
    if (!isEditMode && isEditing) {
      setIsEditing(false);
      // 원래 값으로 복원
      setLocationName(location.name);
      setStartTime(location.startTime);
      setEndTime(location.endTime);
      setDescription(location.description || '');
      setLocType(location.type);
      console.log('수정 모드 비활성화로 인한 편집 모드 종료');
    }
  }, [isEditMode, isEditing, location]);

  // 여행지 삭제 처리 함수
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    // 삭제 확인 다이얼로그
    if (window.confirm(`정말로 "${location.name}" 여행지를 삭제하시겠습니까?`)) {
      if (onDelete) {
        // 현재 selectedDate 값을 저장
        const currentSelectedDate = useTravelStore.getState().selectedDate;
        
        // 삭제 함수 호출
        onDelete(location);
        
        // preservedSelectedDate도 설정
        useTravelStore.setState({
          preservedSelectedDate: currentSelectedDate
        });
      }
    }
  };
  
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
          <div className="flex flex-col">
            <div className="flex items-center mb-1 justify-between">
              <span className="font-semibold text-lg">{location.name}</span>
              
              {/* 수정 모드일 때 삭제 버튼 표시 */}
              {isEditMode && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="여행지 삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center mb-1 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{location.startTime} ~ {location.endTime}</span>
            </div>

            {location.description && (
              <p className="text-sm text-gray-700 mb-2 italic">&ldquo;{location.description}&rdquo;</p>
            )}

            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 w-fit" 
                 style={{ backgroundColor: bgColor, color: textColor }}>
              {label}
            </div>
            
            {/* 편집 모드일 경우 여행 내용 편집 기능 표시 */}
            {isEditMode && (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 버블링 방지
                    setIsEditing(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  여행 내용 수정하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* 편집 화면 */}
        {isEditing && (
          <div className="mt-2 mb-3 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">여행지명</label>
              <input
                type="text"
                className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="여행지명을 입력해주세요"
              />
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">장소 유형</label>
              <select
                className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
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
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">종료 시간</label>
                <input
                  type="time"
                  className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">여행 내용</label>
              <textarea
                className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="여행 내용을 작성해주세요"
                rows={2}
              />
            </div>

            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 수정을 취소하고 원래 값으로 복원
                  setLocationName(location.name);
                  setStartTime(location.startTime);
                  setEndTime(location.endTime);
                  setDescription(location.description || '');
                  setLocType(location.type);
                  // 편집 모드 종료 (해당 여행지만)
                  setIsEditing(false);
                }}
                className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-md"
              >
                취소
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onContentChange) {
                    // 현재 selectedDate 값을 저장
                    const currentSelectedDate = useTravelStore.getState().selectedDate;
                    
                    // 수정된 내용으로 업데이트하고 isModified 플래그 제거
                    onContentChange({
                      ...location,
                      name: locationName,
                      startTime: startTime,
                      endTime: endTime,
                      description: description,
                      type: locType,
                      isModified: false // 여행 내용을 수정하면 위치 수정됨 표시 제거
                    });
                    
                    // 우선 preservedSelectedDate도 설정하여 이후 처리에서 사용되도록 함
                    useTravelStore.setState({
                      preservedSelectedDate: currentSelectedDate
                    });
                  }
                  setIsEditing(false);
                }}
                className="px-2 py-0.5 text-xs text-white bg-blue-500 rounded-md"
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