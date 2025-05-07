'use client';

import React from 'react';

interface TripHeaderProps {
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
}

/**
 * 여행 정보 헤더 컴포넌트
 */
const TripHeader: React.FC<TripHeaderProps> = ({
  destination,
  description,
  startDate,
  endDate
}) => {
  return (
    <div className="w-full mb-6 overflow-x-auto">
      <div className="min-w-max md:min-w-0 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="w-2 h-16 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-800 truncate">{destination}</h2>
            <p className="text-sm text-gray-500 mt-1 truncate max-w-md">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 rounded-md px-3 py-2 border border-gray-200 flex-shrink-0 ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm whitespace-nowrap">{startDate} ~ {endDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TripHeader;
