import React, { useState, useEffect, useCallback } from 'react';
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

const colors = ['#FF5733', '#33C1FF', '#33FF57', '#FFC133', '#C133FF', '#FF33A6', '#33FFD1', '#FF8F33', '#33FF8F', '#8F33FF'];

const MapComponent: React.FC<MapComponentProps> = ({ dayLocations, onMarkerClick }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);
  const setFocusedLocation = useTravelStore((state) => state.setFocusedLocation);

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

  const createCustomMarkerIcon = useCallback((color: string, isFocused: boolean) => {
    if (!mapLoaded || !window.google || !window.google.maps) {
      return {
        path: '',
        fillColor: '',
        fillOpacity: 0,
        strokeColor: '',
        strokeWeight: 0,
        scale: 0,
        labelOrigin: { x: 0, y: 0 },
      };
    }

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 1,
      scale: isFocused ? 14 : 10, // 마우스 오버 시 크기 변경
      labelOrigin: new window.google.maps.Point(0, 0),
    };
  }, [mapLoaded]);

  const createCustomLabel = useCallback((label: string) => {
    if (!mapLoaded || !window.google || !window.google.maps) {
      return null;
    }

    return {
      text: label,
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 'bold',
    };
  }, [mapLoaded]);

  const initialCenter = dayLocations.length > 0 && dayLocations[0].locations.length > 0
    ? dayLocations[0].locations[0]
    : { lat: 0, lng: 0 };

  return (
    <>
      {mapLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialCenter}
          zoom={14}
          options={{
            scrollwheel: true,
          }}
        >
          {dayLocations.map((dayLocation, dayIndex) => {
            const color = colors[dayIndex % colors.length];
            return (
              <React.Fragment key={dayIndex}>
                {dayLocation.locations.map((location, index) => (
                  <Marker
                    key={index}
                    position={{ lat: location.lat, lng: location.lng }}
                    icon={createCustomMarkerIcon(color, focusedLocation === location) as google.maps.Symbol}
                    label={createCustomLabel((index + 1).toString()) as google.maps.MarkerLabel}
                    onClick={() => onMarkerClick(location)}
                    onMouseOver={() => setFocusedLocation(location)}
                    onMouseOut={() => setFocusedLocation(null)}
                  />
                ))}
                {dayLocation.routes.map((route, index) => {
                  const fromLocation = dayLocation.locations.find(loc => loc.name === route.from);
                  const toLocation = dayLocation.locations.find(loc => loc.name === route.to);

                  if (fromLocation && toLocation) {
                    return (
                      <Polyline
                        key={index}
                        path={[fromLocation, toLocation]}
                        options={{
                          strokeColor: focusedRoute === route ? '#FFFF00' : color,
                          strokeOpacity: 1,
                          strokeWeight: focusedRoute === route ? 4 : 2,
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
