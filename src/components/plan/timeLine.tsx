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
    <div className="flex overflow-x-auto space-x-4 p-4">
      {displayLocations.map((dateLocation, dateIndex) => (
        <div key={dateLocation.date} className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
          <div className="mb-4">
            <h3 className="text-3xl font-bold text-center" style={{ color: colors[selectedDate ?? dateIndex] }}>
              Date {selectedDate !== null ? selectedDate + 1 : dateIndex + 1}
            </h3>
            <p className="text-center text-gray-500">{dateLocation.date}</p>
          </div>
          <ul className="space-y-6">
            {dateLocation.locations.map((location, locIndex) => (
              <React.Fragment key={locIndex}>
                <li
                  className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-3 rounded-md transition duration-300"
                  onMouseLeave={onLocationMouseLeave}
                  onClick={() => onLocationClick(location)}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold" style={{ backgroundColor: colors[selectedDate ?? dateIndex] }}>
                    {locIndex + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-lg">{location.name}</span>
                    <span className="block text-sm text-gray-500">({location.startTime} ~ {location.endTime})</span>
                    <p className="text-sm text-gray-700">{location.description}</p>
                    <p className="text-sm text-gray-500">유형: {typeToText(location.type)}</p>
                  </div>
                </li>
                {dateLocation.routes[locIndex] && (
                  <li className="flex items-center space-x-2 pl-14">
                    <div
                      className="cursor-pointer text-blue-500 underline hover:text-blue-700 transition duration-300"
                      onClick={() => onRouteClick(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                      onMouseEnter={() => onRouteMouseEnter(dateLocation.routes[locIndex].fromLocation, dateLocation.routes[locIndex].toLocation)}
                      onMouseLeave={onRouteMouseLeave}
                    >
                      {methodToText(dateLocation.routes[locIndex].method)} ({dateLocation.routes[locIndex].time})
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
