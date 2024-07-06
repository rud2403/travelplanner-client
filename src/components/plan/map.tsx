import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
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
  onMarkerClick: (location: Location) => void;
}

const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

const MapComponent: React.FC<MapComponentProps> = ({ dayLocations, onMarkerClick }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.id = 'googleMaps';
      document.body.appendChild(script);

      script.onload = () => {
        setMapLoaded(true);
      };
    } else {
      setMapLoaded(true);
    }
  }, []);

  const createCustomMarkerIcon = (color: string) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 1,
    scale: 10,
    labelOrigin: new window.google.maps.Point(0, 0),
  });

  const createCustomLabel = (label: string) => ({
    text: label,
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 'bold',
  });

  return (
    <>
      {mapLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={dayLocations[0].locations[0]}
          zoom={14}
          options={{
            scrollwheel: true,
          }}
        >
          {dayLocations.map((dayLocation, dayIndex) => {
            const color = colors[dayIndex];
            return (
              <React.Fragment key={dayIndex}>
                {dayLocation.locations.map((location, index) => (
                  <Marker
                    key={index}
                    position={{ lat: location.lat, lng: location.lng }}
                    icon={createCustomMarkerIcon(color)}
                    label={createCustomLabel((index + 1).toString())}
                    onClick={() => onMarkerClick(location)}
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
        </GoogleMap>
      )}
    </>
  );
};

export default React.memo(MapComponent);
