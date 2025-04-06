'use client';

import React from 'react';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * 사이드바 토글 버튼 컴포넌트
 */
const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <div className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-50 transition-all duration-300 ${isOpen ? 'translate-x-64' : 'translate-x-0'}`}>
      <button
        onClick={onToggle}
        className="group relative flex items-center justify-center h-12 w-12 bg-white rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t border-r border-b border-blue-100 focus:outline-none overflow-hidden"
        aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </div>
        <span className="sr-only">{isOpen ? '닫기' : '열기'}</span>
      </button>
    </div>
  );
};

export default SidebarToggle;
