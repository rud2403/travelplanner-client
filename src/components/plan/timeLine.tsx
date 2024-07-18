import React from 'react';

interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface Route {
  from: string;
  to: string;
  method: number;
  time: string;
}

interface DayLocations {
  day: number;
  locations: Location[];
  routes: Route[];
}

interface TimelineProps {
  dayLocations: DayLocations[];
}

const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

const methodToString = (method: number) => {
  switch (method) {
    case 1:
      return '자동차';
    case 2:
      return '대중교통';
    case 3:
      return '도보';
    default:
      return '';
  }
};

const Timeline: React.FC<TimelineProps> = ({ dayLocations }) => {
  return (
    <div className="flex space-x-8 overflow-x-auto bg-white p-6 rounded-md shadow-lg">
      {dayLocations.map((dayLocation, dayIndex) => (
        <div key={dayLocation.day} className="min-w-[250px]">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-700">Day {dayLocation.day}</h3>
          <ul className="space-y-6">
            {dayLocation.locations.map((location, locIndex) => (
              <li key={locIndex} className="flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: colors[dayIndex] }}
                  >
                    {locIndex + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-lg text-gray-800">{location.name}</span>
                    <p className="text-sm text-gray-600">
                      {location.description} ({location.startTime} - {location.endTime})
                    </p>
                  </div>
                </div>
                {locIndex < dayLocation.routes.length && (
                  <div className="ml-14 pl-4 border-l-2 border-gray-300 text-gray-600">
                    <span className="block">{methodToString(dayLocation.routes[locIndex].method)}</span>
                    <span>{dayLocation.routes[locIndex].time}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
