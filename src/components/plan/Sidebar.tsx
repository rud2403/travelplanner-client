'use client';

import React from 'react';
import DateButton from '../common/DateButton';
import { TravelPlan } from '@/data/travelPlanData';

interface SidebarProps {
  isOpen: boolean;
  selectedDate: number | null;
  dateLocations: TravelPlan[];
  onDateClick: (date: number | null) => void;
}

/**
 * 여행 일정 사이드바 컴포넌트
 */
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  selectedDate,
  dateLocations,
  onDateClick
}) => {
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
        
        {dateLocations.map((dateLocation, index) => (
          <DateButton
            key={index}
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
              <span className={`ml-auto text-xs ${selectedDate === index ? 'text-gray-200' : 'text-gray-500'}`}>
                {dateLocation.date}
              </span>
            }
          >
            {index + 1}일차
          </DateButton>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
