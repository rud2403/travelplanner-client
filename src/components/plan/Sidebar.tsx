'use client';

import React from 'react';
import DateButton from '../common/DateButton';
import travelPlanData from '@/data/travelPlanData';

interface SidebarProps {
  isOpen: boolean;
  selectedDate: number | null;
  dateLocations: typeof travelPlanData;
  onDateClick: (date: number | null) => void;
  isEditMode?: boolean;
  onAddNewDay?: () => void;
  onDeleteDay?: (dayIndex: number) => void; // N일차 삭제 함수 추가
}

/**
 * 여행 일정 사이드바 컴포넌트
 */
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  selectedDate,
  dateLocations,
  onDateClick,
  isEditMode = false,
  onAddNewDay,
  onDeleteDay
}) => {
  // 디버깅용 콘솔 로그 추가
  console.log('Sidebar 렌더링:', { isEditMode, hasAddNewDay: !!onAddNewDay });
  
  return (
    <aside
      className={`
        fixed top-16 bottom-16 left-0 z-40 w-64 p-6 shadow-xl 
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-gradient-to-b from-blue-50 to-indigo-50 rounded-r-2xl 
        border-r border-t border-b border-blue-100
      `}
    >
      <h2 className="text-xl font-bold mb-6 text-blue-800 text-center border-b border-blue-200 pb-4">
        여행 일정
      </h2>
      <nav className="flex flex-col space-y-4">
        <div className="mb-2 w-full">
          <DateButton
            isActive={selectedDate === null}
            onClick={() => onDateClick(null)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            }
          >
            전체 일정
          </DateButton>
        </div>
        
        {dateLocations.map((dateLocation, index) => (
          <div key={index} className="flex flex-col mb-3 w-full">
            {/* 날짜 정보를 위에 배치 */}
            <div className="text-xs text-gray-500 mb-1 pl-2 font-medium">
              {dateLocation.date}
            </div>
            
            <div className="relative w-full">
              <DateButton
                isActive={selectedDate === index}
                onClick={() => onDateClick(index)}
                icon={
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 mr-2 ${selectedDate === index ? 'text-white' : 'text-blue-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                rightContent={
                  isEditMode && onDeleteDay ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 버블링 방지
                        onDeleteDay(index);
                      }}
                      className={`ml-auto p-1 rounded-full ${selectedDate === index ? 'text-white hover:text-red-200' : 'text-gray-400 hover:text-red-500'} transition-colors duration-200`}
                      title={`${index + 1}일차 삭제`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  ) : null
                }
              >
                {index + 1}일차
              </DateButton>
            </div>
          </div>
        ))}
        
        {/* 일차 추가 버튼 (수정 모드에서만 보이도록) */}
        {isEditMode && onAddNewDay && (
          <div className="mt-6">
            <button
              onClick={onAddNewDay}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              일차 추가
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
