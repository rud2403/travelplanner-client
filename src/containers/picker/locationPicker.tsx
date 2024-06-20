import React, { useState } from 'react';
import PickerModal from '@/components/modal/pickerModal';

interface LocationPickerModalProps {
  onClose: () => void;
  onNext: () => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ onClose, onNext }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  return (
    <PickerModal title="출발지와 도착지를 선택해주세요" onClose={onClose} onNext={onNext}>
      <div className="mb-6">
        <label className="block text-2xl mb-4 font-semibold text-gray-700">출발지</label>
        <input
          type="text"
          className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="출발지를 입력하세요"
        />
      </div>
      <div className="mb-6">
        <label className="block text-2xl mb-4 font-semibold text-gray-700">도착지</label>
        <input
          type="text"
          className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          placeholder="도착지를 입력하세요"
        />
      </div>
    </PickerModal>
  );
};

export default LocationPickerModal;
