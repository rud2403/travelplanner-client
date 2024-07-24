import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation } from '@/services/dayLocations';

interface TimelineProps {
  onRouteClick: (from: string, to: string) => void;
  onRouteMouseEnter: (from: string, to: string) => void;
  onRouteMouseLeave: () => void;
  // onLocationMouseEnter: (location: TravelLocation) => void;
  onLocationMouseLeave: () => void;
  onLocationClick: (location: TravelLocation) => void;
}

const TimeLine: React.FC<TimelineProps> = ({
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  // onLocationMouseEnter,
  onLocationMouseLeave,
  onLocationClick,
}) => {
  const dayLocations = useTravelStore((state) => state.dayLocations);

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

  const colors = ['#FF5733', '#33C1FF', '#33FF57', '#FFC133', '#C133FF', '#FF33A6', '#33FFD1', '#FF8F33', '#33FF8F', '#8F33FF'];

  return (
    <div className="flex flex-col p-4">
      <div className="flex space-x-4 overflow-x-auto">
        {dayLocations.map((dayLocation, dayIndex) => (
          <div key={dayLocation.day} className="flex-1 bg-white p-6 rounded-lg shadow-lg min-w-[300px] flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1 text-center" style={{ color: colors[dayIndex] }}>Day {dayIndex + 1}</h3>
              <p className="text-sm text-center text-gray-500 mb-6">{dayLocation.day.slice(0, 4)}-{dayLocation.day.slice(4, 6)}-{dayLocation.day.slice(6)}</p>
              <ul className="space-y-6">
                {dayLocation.locations.map((location, locIndex) => (
                  <React.Fragment key={locIndex}>
                    <li
                      className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-3 rounded-md transition duration-300"
                      // onMouseEnter={() => onLocationMouseEnter(location)}
                      onMouseLeave={onLocationMouseLeave}
                      onClick={() => onLocationClick(location)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold" style={{ backgroundColor: colors[dayIndex] }}>
                        {locIndex + 1}
                      </div>
                      <div>
                        <span className="font-semibold text-lg">{location.name}</span>
                        <span className="block text-sm text-gray-500">({location.startTime} ~ {location.endTime})</span>
                        <p className="text-sm text-gray-700">{location.description}</p>
                        <p className="text-sm text-gray-500">유형: {typeToText(location.type)}</p>
                      </div>
                    </li>
                    {dayLocation.routes[locIndex] && (
                      <li className="flex items-center space-x-2 pl-14">
                        <div
                          className="cursor-pointer text-blue-500 underline hover:text-blue-700 transition duration-300"
                          onClick={() => onRouteClick(dayLocation.routes[locIndex].from, dayLocation.routes[locIndex].to)}
                          onMouseEnter={() => onRouteMouseEnter(dayLocation.routes[locIndex].from, dayLocation.routes[locIndex].to)}
                          onMouseLeave={onRouteMouseLeave}
                        >
                          {methodToText(dayLocation.routes[locIndex].method)} ({dayLocation.routes[locIndex].time})
                        </div>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
