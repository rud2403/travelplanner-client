import React, { useEffect, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, DayLocations } from '@/services/dayLocations';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries = ['places'];

interface MapComponentProps {
  dayLocations: DayLocations[];
  onMarkerClick: (location: TravelLocation) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ dayLocations, onMarkerClick }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);
  const selectedDay = useTravelStore((state) => state.selectedDay);
  const colors = useTravelStore((state) => state.colors);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.panTo({ lat: focusedLocation.lat, lng: focusedLocation.lng });
      mapRef.current.setZoom(15);
    }
  }, [focusedLocation]);

  useEffect(() => {
    if (selectedDay !== null && mapRef.current && dayLocations[selectedDay]?.locations[0]) {
      mapRef.current.panTo({ lat: dayLocations[selectedDay].locations[0].lat, lng: dayLocations[selectedDay].locations[0].lng });
      mapRef.current.setZoom(14);
    }
  }, [selectedDay, dayLocations]);

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

  console.log('selectedDay:', selectedDay);

  const displayLocations = selectedDay !== null ? [dayLocations[selectedDay]] : dayLocations;

  console.log('displayLocations:', displayLocations);

  return (
    <GoogleMap
      key={selectedDay}
      mapContainerStyle={containerStyle}
      center={dayLocations[0]?.locations[0] || { lat: 0, lng: 0 }}
      zoom={14}
      onLoad={handleLoad}
      options={{
        scrollwheel: true,
      }}
    >
      {dayLocations.map((dayLocation, dayIndex) => {
        if (!dayLocation || !dayLocation.locations) {
          return null;
        }

        const color = colors[dayLocation.index];
        console.log('dayLocation.index : ', dayLocation.index);
        return (
          <React.Fragment key={dayLocation.day}>
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
                const pathArray = [fromLocation, toLocation];

                // console.log('route.from:', route.from);
                // console.log('route.to:', route.to);
                // console.log('selectedDay:', selectedDay);
                return (
                  <Polyline
                    key={`${route.from}-${route.to}-${selectedDay}`}
                    path={pathArray}
                    options={{
                      strokeColor: focusedRoute === route ? '#FFFF00' : color,
                      strokeOpacity: 1,
                      strokeWeight: focusedRoute === route ? 4 : 2,
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
