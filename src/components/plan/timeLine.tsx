import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation } from '@/data/travelPlanData';

interface TimelineProps {
  onRouteClick: (fromLocation: string, toLocation: string) => void;
  onRouteMouseEnter: (fromLocation: string, toLocation: string) => void;
  onRouteMouseLeave: () => void;
  onLocationMouseEnter: (location: TravelLocation) => void;
  onLocationMouseLeave: () => void;
  onLocationClick: (location: TravelLocation) => void;
}

const TimeLine: React.FC<TimelineProps> = ({
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  onLocationMouseEnter,
  onLocationMouseLeave,
  onLocationClick,
}) => {
  const dateLocations = useTravelStore((state) => state.dateLocations);
  const selectedDate = useTravelStore((state) => state.selectedDate);
  const colors = useTravelStore((state) => state.colors);

  const methodToText = (method: number) => {
    switch (method) {
      case 1: return '자동차';
      case 2: return '대중교통';
      case 3: return '도보';
      default: return '';
    }
  };

  const typeToText = (type: number) => {
    switch (type) {
      case 1: return '관광지';
      case 2: return '식당';
      case 3: return '숙소';
      case 4: return '쇼핑';
      default: return '';
    }
  };

  const displayLocations = selectedDate !== null ? [dateLocations[selectedDate]] : dateLocations;

  return (
    <div className="flex overflow-x-auto space-x-6 p-4 pb-6 hide-scrollbar">
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {displayLocations.map((dateLocation, dateIndex) => (
        <div key={dateLocation.date} className="bg-white p-6 rounded-xl shadow-xl min-w-[320px] border border-gray-100 hover:border-blue-200 transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-center mb-2" style={{ color: colors[selectedDate ?? dateIndex] }}>
            {selectedDate !== null ? selectedDate + 1 : dateIndex + 1}일차
            </h3>
            <p className="text-center text-gray-500 font-medium">{dateLocation.date}</p>
          </div>
          <ul className="space-y-6">
            {dateLocation.locations.map((location, locIndex) => (
              <React.Fragment key={locIndex}>
                <li
                  className="flex items-center space-x-4 cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 border border-transparent hover:border-blue-200"
                  onMouseEnter={() => onLocationMouseEnter(location)}
                  onMouseLeave={onLocationMouseLeave}
                  onClick={() => onLocationClick(location)}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold flex-shrink-0 shadow-md" style={{ backgroundColor: colors[selectedDate ?? dateIndex], aspectRatio: "1 / 1", minWidth: "3rem" }}>
                    {locIndex + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-lg block mb-1">{location.name}</span>
                    <div className="flex items-center mb-1 text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{location.startTime} ~ {location.endTime}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 italic">"{location.description}"</p>
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {typeToText(location.type)}
                    </div>
                  </div>
                </li>
                {dateLocation.routes[locIndex] && (
                  <li className="flex items-center space-x-2 pl-16 pb-4">
                    <div className="border-l-2 border-dashed h-10 -mt-2 ml-6 border-gray-300"></div>
                    <div
                      className="cursor-pointer ml-2 flex items-center p-2 px-4 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 shadow-sm"
                      onClick={() => onRouteClick(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                      onMouseEnter={() => onRouteMouseEnter(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                      onMouseLeave={onRouteMouseLeave}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {dateLocation.routes[locIndex].method === 1 && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        )}
                        {dateLocation.routes[locIndex].method === 2 && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        )}
                        {dateLocation.routes[locIndex].method === 3 && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        )}
                      </svg>
                      <span className="font-medium">{methodToText(dateLocation.routes[locIndex].method)}</span>
                      <span className="ml-2 text-xs text-blue-500">({dateLocation.routes[locIndex].time})</span>
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TimeLine;
