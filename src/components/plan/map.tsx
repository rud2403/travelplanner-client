import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, DayLocations } from '@/services/dayLocations';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const colors = ['#FF5733', '#33C1FF', '#33FF57', '#FFC133', '#C133FF', '#FF33A6', '#33FFD1', '#FF8F33', '#33FF8F', '#8F33FF'];

interface MapComponentProps {
  dayLocations: DayLocations[];
  onMarkerClick: (location: TravelLocation) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ dayLocations, onMarkerClick }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.panTo({ lat: focusedLocation.lat, lng: focusedLocation.lng });
      mapRef.current.setZoom(15);
    }
  }, [focusedLocation]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const createCustomMarkerIcon = (color: string, isFocused: boolean) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: isFocused ? 2 : 1,
    scale: isFocused ? 16 : 8,
    labelOrigin: new google.maps.Point(0, 0),
  });

  const createCustomLabel = (label: string) => ({
    text: label,
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 'bold',
  });

  const handleLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={dayLocations[0].locations[0]}
      zoom={14}
      onLoad={handleLoad}
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
                icon={createCustomMarkerIcon(color, focusedLocation === location)}
                label={createCustomLabel((index + 1).toString())}
                onClick={() => onMarkerClick(location)}
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
  );
};

export default React.memo(MapComponent);
