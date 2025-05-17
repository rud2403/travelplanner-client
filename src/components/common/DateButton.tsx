'use client';

import React from 'react';

interface DateButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}

/**
 * 여행 일정 선택을 위한 재사용 가능한 버튼 컴포넌트
 */
const DateButton: React.FC<DateButtonProps> = ({ 
  isActive, 
  onClick, 
  icon, 
  children, 
  rightContent 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center p-3 w-full
        ${isActive 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
          : 'bg-white text-blue-800 hover:bg-blue-50'} 
        rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border 
        ${isActive ? '' : 'border-blue-100'}
      `}
    >
      {icon}
      <span className="font-medium">{children}</span>
      {rightContent}
    </button>
  );
};

export default DateButton;
