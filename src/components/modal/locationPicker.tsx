import React from 'react';
import CommonButton from '@/components/button/commonButton';

interface LocationPickerProps {
  departure: string;
  arrival: string;
  setDeparture: (value: string) => void;
  setArrival: (value: string) => void;
  onClose: () => void;
  onNext: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  departure,
  arrival,
  setDeparture,
  setArrival,
  onClose,
  onNext,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">출발지와 도착지를 선택해주세요</h2>
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
        <div className="mt-8 flex justify-center gap-6">
          <CommonButton label="취소" onClick={onClose} color="gray" />
          <CommonButton label="다음" onClick={onNext} color="blue" />
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
