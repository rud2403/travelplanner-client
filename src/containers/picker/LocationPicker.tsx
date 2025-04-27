import React, { useState } from 'react';
import PickerModal from '@/components/modal/PickerModal';
import { travelLocations } from '@/data/travelLocations'; // 데이터 파일 임포트

interface LocationPickerModalProps {
  onClose: () => void;
  onNext: () => void;
  destination: string;
  setDestination: (value: string) => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  onClose,
  onNext,
  destination,
  setDestination,
}) => {
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setCity(''); // Reset city when country changes
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setDestination(`${country} - ${e.target.value}`);
  };

  return (
    <PickerModal title="여행지를 선택해주세요" onClose={onClose} onNext={onNext}>
      <div className="mb-6">
        <select
          className="w-full p-4 mb-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={country}
          onChange={handleCountryChange}
        >
          <option value="" disabled>상위 카테고리를 선택하세요</option>
          {Object.keys(travelLocations).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={city}
          onChange={handleCityChange}
          disabled={!country}
        >
          <option value="" disabled>하위 카테고리를 선택하세요</option>
          {country && travelLocations[country].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </PickerModal>
  );
};

export default LocationPickerModal;
