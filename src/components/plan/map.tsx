import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { useTravelStore } from '@/store/useTravelStore';
import { DayLocations, TravelLocation, Route } from '@/services/dayLocations';

const containerStyle = {
  width: '100%',
  height: '100%',
};

interface MapComponentProps {
  dayLocations: DayLocations[];
  onMarkerClick: (location: TravelLocation) => void;
}

const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

const MapComponent: React.FC<MapComponentProps> = ({ dayLocations, onMarkerClick }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);

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

  const createCustomMarkerIcon = (color: string, isFocused: boolean) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: isFocused ? '#FFFF00' : color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: isFocused ? 3 : 1,
    scale: isFocused ? 12 : 10,
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
          center={dayLocations[0]?.locations[0] || { lat: 0, lng: 0 }}
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
                    icon={createCustomMarkerIcon(color, focusedLocation?.name === location.name)}
                    label={createCustomLabel((index + 1).toString())}
                    onClick={() => onMarkerClick(location)}
                  />
                ))}
                {dayLocation.routes.map((route, index) => {
                  const fromLocation = dayLocation.locations.find(loc => loc.name === route.from) || null;
                  const toLocation = dayLocation.locations.find(loc => loc.name === route.to) || null;

                  if (fromLocation && toLocation) {
                    return (
                      <Polyline
                        key={index}
                        path={[fromLocation, toLocation]}
                        options={{
                          strokeColor: focusedRoute?.from === route.from && focusedRoute?.to === route.to ? '#FFFF00' : color,
                          strokeOpacity: 1,
                          strokeWeight: focusedRoute?.from === route.from && focusedRoute?.to === route.to ? 4 : 2,
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
