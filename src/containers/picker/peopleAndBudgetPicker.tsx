import React from 'react';
import PickerModal from '@/components/modal/pickerModal';

interface PeopleAndBudgetModalProps {
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  numberOfPeople: number;
  setNumberOfPeople: (value: number) => void;
  budget: number;
  setBudget: (value: number) => void;
}

const PeopleAndBudgetModal: React.FC<PeopleAndBudgetModalProps> = ({ onClose, onNext, onPrevious, numberOfPeople, setNumberOfPeople, budget, setBudget }) => {
  const formatBudget = (value: number): string => {
    return value.toLocaleString();
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/,/g, ''));
    setBudget(value);
  };

  return (
    <PickerModal title="인원수와 예산을 입력해주세요" onClose={onClose} onNext={onNext} onPrevious={onPrevious}>
      <div className="mb-6">
        <label className="block text-2xl mb-4 font-semibold text-gray-700">인원수</label>
        <input
          type="number"
          className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(Number(e.target.value))}
          placeholder="인원수를 입력하세요"
        />
      </div>
      <div className="mb-6">
        <label className="block text-2xl mb-4 font-semibold text-gray-700">예산</label>
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            className="w-full p-4 text-lg rounded-lg focus:outline-none text-gray-800"
            value={formatBudget(budget)}
            onChange={handleBudgetChange}
            placeholder="예산을 입력하세요"
          />
          <span className="p-4 rounded-r-lg text-gray-800">원</span>
        </div>
      </div>
    </PickerModal>
  );
};

export default PeopleAndBudgetModal;
