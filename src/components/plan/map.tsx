import React, { useEffect, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useTravelStore } from '@/store/useTravelStore';
import { TravelLocation, TravelPlan } from '@/data/travelPlanData';

const containerStyle = {
  width: '100%',
  height: '100%',
};

interface MapComponentProps {
  travelPlanData: TravelPlan[];
  onMarkerClick: (location: TravelLocation) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ travelPlanData, onMarkerClick }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const focusedLocation = useTravelStore((state) => state.focusedLocation);
  const focusedRoute = useTravelStore((state) => state.focusedRoute);
  const selectedDate = useTravelStore((state) => state.selectedDate);
  const colors = useTravelStore((state) => state.colors);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      console.log('focusedLocation.lat : ', focusedLocation.lat)
      console.log('focusedLocation.lng : ', focusedLocation.lng)
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
      key={selectedDate}
      mapContainerStyle={containerStyle}
      center={travelPlanData[0]?.locations[0] || { lat: 0, lng: 0 }}
      zoom={14}
      onLoad={handleLoad}
      options={{
        scrollwheel: true,
      }}
    >
      {travelPlanData.map((dateLocation, dateIndex) => {
        if (!dateLocation || !dateLocation.locations) {
          return null;
        }

        const color = colors[dateLocation.index];
        // console.log('dateLocation.index : ', dateLocation.index);
        return (
          <React.Fragment key={dateLocation.date}>
            {dateLocation.locations.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.lat, lng: location.lng }}
                icon={createCustomMarkerIcon(color, focusedLocation === location)}
                label={createCustomLabel((index + 1).toString())}
                onClick={() => onMarkerClick(location)}
              />
            ))}
            {dateLocation.routes.map((route, index) => {
              const fromLocation = dateLocation.locations.find(loc => loc.name === route.from);
              const toLocation = dateLocation.locations.find(loc => loc.name === route.to);

              if (fromLocation && toLocation) {
                const pathArray = [fromLocation, toLocation];

                // console.log('route.from:', route.from);
                // console.log('route.to:', route.to);
                // console.log('selectedDate:', selectedDate);
                return (
                  <Polyline
                    key={`${route.from}-${route.to}-${selectedDate}`}
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
