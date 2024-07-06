import React from 'react';
import CommonButton from '@/components/button/commonButton';

interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
}

interface TravelModalProps {
  location: Location | null;
  onClose: () => void;
}

const TravelModal: React.FC<TravelModalProps> = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">{location.name}</h2>
        <p><strong>Latitude:</strong> {location.lat}</p>
        <p><strong>Longitude:</strong> {location.lng}</p>
        <p><strong>Description:</strong> {location.description}</p>
        <div className="mt-8 flex justify-center">
          <CommonButton label="닫기" onClick={onClose} color="gray" />
        </div>
      </div>
    </div>
  );
};

export default TravelModal;
