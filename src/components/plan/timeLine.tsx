import React from 'react';

interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
}

interface DayLocations {
  day: number;
  locations: Location[];
}

interface TimelineProps {
  dayLocations: DayLocations[];
}

const Timeline: React.FC<TimelineProps> = ({ dayLocations }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {dayLocations.map((dayLocation) => (
        <div key={dayLocation.day} className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Day {dayLocation.day}</h3>
          <ul className="space-y-2">
            {dayLocation.locations.map((location, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>{location.name} - {location.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
