'use client';

import React, { useEffect, useState } from 'react';
import { TravelRoute } from '@/types/travel';
import { TRANSPORT_TYPE_MAP, TRANSPORT_ICON_PATHS } from '../common/constants';
import { useTravelStore } from '@/store/useTravelStore';

interface RouteItemProps {
  route: TravelRoute;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isEditMode?: boolean;
  onRouteChange?: (route: TravelRoute, dayIndex: number, routeIndex: number) => void;
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
      if (Number(route.time) || 0) {
        try {
          return Number(route.time) || 30;
        } catch (e) {
          return 30; // 오류 발생 시 30분으로 기본 설정
        }
      }
      return 30; // 시간 없으면 30분으로 기본 설정
    })()
  );

  // 편집 시작 시 상태 초기화
  useEffect(() => {
    if (isEditing) {
      setTransportType(route.transportationType || route.method || 1);
      // 시간 형식에서 분 단위로 변환
      if (route.time) {
        try {
          setTransportMinutes(Number(route.time) || 30); // 시간값 없는 경우 30분으로 설정
        } catch (e) {
          // 시간 형식이 잘못된 경우 기본값 30분 사용
          setTransportMinutes(30);
        }
      } else {
        setTransportMinutes(30); // 기본값 30분
      }
    }
  }, [isEditing, route]);
  
  // 수정 모드(isEditMode)가 변경될 때 isEditing 초기화
  useEffect(() => {
    // 수정 모드가 비활성화되면 편집 모드도 끄기
    if (!isEditMode && isEditing) {
      setIsEditing(false);
      // 원래 값으로 복원
      setTransportType(route.transportationType || route.method || 1);
      if (route.time) {
        try {
          setTransportMinutes(Number(route.time) || 30);
        } catch (e) {
          setTransportMinutes(30);
        }
      } else {
        setTransportMinutes(30);
      }
      console.log('수정 모드 비활성화로 인한 이동방법 편집 모드 종료');
    }
  }, [isEditMode, isEditing, route]);

  // 경로 변경 함수
  const handleSaveRouteChanges = () => {
    if (onRouteChange) {
      // 현재 selectedDate 값을 저장
      const currentSelectedDate = useTravelStore.getState().selectedDate;
      
      const updatedRoute = {
        ...route,
        transportationType: transportType,
        method: transportType, // 이전 속성과의 호환성을 위해 양쪽 다 업데이트
        time: transportMinutes.toString()
      };
      onRouteChange(updatedRoute, dayIndex, routeIndex);
      
      // 우선 preservedSelectedDate도 설정하여 이후 처리에서 사용되도록 함
      useTravelStore.setState({
        preservedSelectedDate: currentSelectedDate
      });
    }
    setIsEditing(false);
  };

  return (
    <li className="flex items-center space-x-2 pl-16 pb-4">
      <div className="border-l-2 border-dashed h-10 -mt-2 ml-6 border-gray-300"></div>
      {!isEditing ? (
        <div className="flex flex-col">
          <div
            className="cursor-pointer ml-2 flex items-center p-1.5 px-3 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 shadow-sm text-xs"
            onClick={isEditMode ? (e) => {
              e.stopPropagation();
              setIsEditing(true);
            } : onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={TRANSPORT_ICON_PATHS[methodType]?.path || "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
            <span className="font-medium">{TRANSPORT_TYPE_MAP[methodType] || '이동'}</span>
            {route.time && (
              <span className="ml-1 text-xs text-blue-500">
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
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="ml-2 mt-1 text-xs text-blue-500 hover:text-blue-700"
            >
              이동방법 수정
            </button>
          )}
        </div>
      ) : (
        <div className="ml-2 p-2 bg-blue-50 rounded-lg shadow-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-2 mb-2 text-xs">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">이동 방법</label>
              <select
              className="w-full p-1 border border-gray-300 rounded-md text-xs"
              value={transportType}
              onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              setTransportType(isNaN(parsed) ? 1 : parsed);
              }}
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
                  className="w-full p-1 border border-gray-300 rounded-md text-xs"
                  value={transportMinutes}
                  onChange={(e) => setTransportMinutes(parseInt(e.target.value) || 0)}
                />
                <span className="ml-1 text-xs text-gray-500">분</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 편집 모드 종료
                setIsEditing(false);
                // 원래 값으로 되돌리기 (취소)
                if (route.time) {
                  try {
                    setTransportMinutes(Number(route.time) || 30);
                  } catch (e) {
                    setTransportMinutes(30);
                  }
                } else {
                  setTransportMinutes(30);
                }
                setTransportType(route.transportationType || route.method || 1);
              }}
              className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-md"
            >
              취소
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveRouteChanges();
              }}
              className="px-2 py-0.5 text-xs text-white bg-blue-500 rounded-md"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default RouteItem;