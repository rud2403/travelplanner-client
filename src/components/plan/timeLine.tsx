import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, Route } from '@/services/dayLocations';

interface TimelineProps {
  onRouteClick: (from: string, to: string) => void;
  onRouteMouseEnter: (from: string, to: string) => void;
  onRouteMouseLeave: () => void;
  onLocationMouseEnter: (location: TravelLocation) => void;
  onLocationMouseLeave: () => void;
  onLocationClick: (location: TravelLocation) => void; // 추가된 부분
}

const TimeLine: React.FC<TimelineProps> = ({
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  onLocationMouseEnter,
  onLocationMouseLeave,
  onLocationClick, // 추가된 부분
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

  const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

  return (
    <div className="flex space-x-4 overflow-x-auto">
      {dayLocations.map((dayLocation, dayIndex) => (
        <div key={dayLocation.day} className="flex-1 bg-white p-4 rounded-md shadow-md min-w-[250px]">
          <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: colors[dayIndex] }}>Day {dayLocation.day}</h3>
          <ul className="space-y-4">
            {dayLocation.locations.map((location, locIndex) => (
              <React.Fragment key={locIndex}>
                <li
                  className="flex items-center space-x-2 cursor-pointer"
                  onMouseEnter={() => onLocationMouseEnter(location)}
                  onMouseLeave={onLocationMouseLeave}
                  onClick={() => onLocationClick(location)} // 추가된 부분
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold" style={{ backgroundColor: colors[dayIndex] }}>
                    {locIndex + 1}
                  </div>
                  <div>
                    <span className="font-semibold">{location.name}</span>
                    <span> ({location.startTime} ~ {location.endTime})</span>
                    <p className="text-sm text-gray-600">{location.description}</p>
                  </div>
                </li>
                {dayLocation.routes[locIndex] && (
                  <li className="flex items-center space-x-2">
                    <div
                      className="cursor-pointer text-blue-500"
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
      ))}
    </div>
  );
};

export default TimeLine;
