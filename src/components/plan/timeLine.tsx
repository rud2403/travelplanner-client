import React from 'react';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation } from '@/data/travelPlanData';

interface TimelineProps {
  onRouteClick: (from: string, to: string) => void;
  onRouteMouseEnter: (from: string, to: string) => void;
  onRouteMouseLeave: () => void;
  onLocationMouseLeave: () => void;
  onLocationClick: (location: TravelLocation) => void;
}

const TimeLine: React.FC<TimelineProps> = ({
  onRouteClick,
  onRouteMouseEnter,
  onRouteMouseLeave,
  onLocationMouseLeave,
  onLocationClick,
}) => {
  const dayLocations = useTravelStore((state) => state.dayLocations);
  const selectedDay = useTravelStore((state) => state.selectedDay);
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

  const displayLocations = selectedDay !== null ? [dayLocations[selectedDay]] : dayLocations;

  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {displayLocations.map((dayLocation, dayIndex) => (
        <div key={dayLocation.day} className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
          <div className="mb-4">
            <h3 className="text-3xl font-bold text-center" style={{ color: colors[selectedDay ?? dayIndex] }}>
              Day {selectedDay !== null ? selectedDay + 1 : dayIndex + 1}
            </h3>
            <p className="text-center text-gray-500">{dayLocation.day}</p>
          </div>
          <ul className="space-y-6">
            {dayLocation.locations.map((location, locIndex) => (
              <React.Fragment key={locIndex}>
                <li
                  className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-3 rounded-md transition duration-300"
                  onMouseLeave={onLocationMouseLeave}
                  onClick={() => onLocationClick(location)}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold" style={{ backgroundColor: colors[selectedDay ?? dayIndex] }}>
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
      ))}
    </div>
  );
};

export default TimeLine;
