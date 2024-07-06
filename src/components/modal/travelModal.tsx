// src/components/modal/TravelModal.tsx
import React from 'react';

interface TravelModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const TravelModal: React.FC<TravelModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl h-96 relative text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        {children}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelModal;
