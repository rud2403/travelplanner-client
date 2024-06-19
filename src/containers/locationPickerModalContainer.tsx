import React, { useState } from 'react';
import LocationPicker from '@/components/modal/locationPicker';

interface LocationPickerModalContainerProps {
  onClose: () => void;
  onNext: () => void;
}

const LocationPickerModalContainer: React.FC<LocationPickerModalContainerProps> = ({ onClose, onNext }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  return (
    <LocationPicker
      departure={departure}
      arrival={arrival}
      setDeparture={setDeparture}
      setArrival={setArrival}
      onClose={onClose}
      onNext={onNext}
    />
  );
};

export default LocationPickerModalContainer;
