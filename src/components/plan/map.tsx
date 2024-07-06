// src/components/plan/map.tsx
import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import TravelModal from '@/components/modal/travelModal';

const containerStyle = {
  width: '100%',
  height: '400px',
};

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

interface MapComponentProps {
  dayLocations: DayLocations[];
}

const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

const MapComponent: React.FC<MapComponentProps> = ({ dayLocations }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const createCustomMarkerIcon = (color: string) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 1,
    scale: 10,
    labelOrigin: new google.maps.Point(0, 0),
  });

  const createCustomLabel = (label: string) => ({
    text: label,
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 'bold',
  });

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={dayLocations[0].locations[0]}
        zoom={14}
        options={{
          scrollwheel: true,
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {map &&
          dayLocations.map((dayLocation, dayIndex) => {
            const color = colors[dayIndex];

            return (
              <React.Fragment key={dayIndex}>
                {dayLocation.locations.map((location, index) => (
                  <Marker
                    key={index}
                    position={{ lat: location.lat, lng: location.lng }}
                    icon={createCustomMarkerIcon(color)}
                    label={createCustomLabel((index + 1).toString())}
                    onClick={() => handleMarkerClick(location)}
                  />
                ))}
                {dayLocation.locations.map((location, index) => {
                  if (index < dayLocation.locations.length - 1) {
                    return (
                      <Polyline
                        key={index}
                        path={[dayLocation.locations[index], dayLocation.locations[index + 1]]}
                        options={{
                          strokeColor: color,
                          strokeOpacity: 1,
                          strokeWeight: 2,
                          icons: [
                            {
                              icon: {
                                path: 'M 0,-1 0,1',
                                strokeOpacity: 1,
                                scale: 4,
                              },
                              offset: '0',
                              repeat: '10px',
                            },
                          ],
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </React.Fragment>
            );
          })}
        {selectedLocation && (
          <TravelModal title="Marker Information" onClose={handleCloseModal}>
            <p>
              <strong>Location:</strong> {selectedLocation.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedLocation.description}
            </p>
            <p>
              <strong>Latitude:</strong> {selectedLocation.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedLocation.lng}
            </p>
          </TravelModal>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(MapComponent);
