import React from 'react';

interface CommonButtonProps {
  label: string;
  onClick: () => void;
  color: 'blue' | 'gray';
}

const CommonButton: React.FC<CommonButtonProps> = ({ label, onClick, color }) => {
  const bgColor = color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600';

  return (
    <button
      className={`${bgColor} text-white py-4 px-8 rounded-lg transition duration-300 text-lg font-semibold`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CommonButton;
