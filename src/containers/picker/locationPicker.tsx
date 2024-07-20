import React from 'react';
import PickerModal from '@/components/modal/pickerModal';

interface LocationPickerModalProps {
  onClose: () => void;
  onNext: () => void;
  destination: string; // 도착지를 여행지로 변경
  setDestination: (value: string) => void; // 여행지 설정 함수
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  onClose,
  onNext,
  destination,
  setDestination,
}) => {
  return (
    <PickerModal title="여행지를 선택해주세요" onClose={onClose} onNext={onNext}>
      <div className="mb-6">
        <label className="block text-2xl mb-4 font-semibold text-gray-700">여행지</label>
        <input
          type="text"
          className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="여행지를 입력하세요"
        />
      </div>
    </PickerModal>
  );
};

export default LocationPickerModal;
