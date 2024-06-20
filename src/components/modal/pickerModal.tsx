import React from 'react';
import CommonButton from '@/components/button/commonButton';

interface PickerModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  onPrevious?: () => void;
}

const PickerModal: React.FC<PickerModalProps> = ({ title, children, onClose, onNext, onPrevious }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">{title}</h2>
        {children}
        <div className="mt-8 flex justify-center gap-6">
          <CommonButton label="취소" onClick={onClose} color="gray" />
          {onPrevious && <CommonButton label="이전" onClick={onPrevious} color="gray" />}
          <CommonButton label="다음" onClick={onNext} color="blue" />
        </div>
      </div>
    </div>
  );
};

export default PickerModal;
