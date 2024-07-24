// pages/index.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePickerModal from '@/containers/picker/datePicker';
import LocationPickerModal from '@/containers/picker/locationPicker';
import PeopleAndBudgetModal from '@/containers/picker/peopleAndBudgetPicker';
import { useTravelStore } from '@/store/useTravelStore';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const {
    resetState,
    setDestination,
    setStartDate,
    setEndDate,
    // setNumberOfPeople,
    // setBudget,
  } = useTravelStore();

  const [destination, setLocalDestination] = useState('');
  const [dateRange, setLocalDateRange] = useState<[string, string] | null>(null);
  const [numberOfPeople, setLocalNumberOfPeople] = useState(1);
  const [budget, setLocalBudget] = useState(0);

  const toggleModal = () => {
    if (isModalOpen) {
      resetState(); // Reset zustand state when modal is closed
      setStep(1); // Reset step when modal is closed
      resetLocalState(); // Reset local state when modal is closed
    }
    setIsModalOpen(!isModalOpen);
  };

  const resetLocalState = () => {
    setLocalDestination('');
    setLocalDateRange(null);
    setLocalNumberOfPeople(1);
    setLocalBudget(0);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleFinish = () => {
    setDestination(destination);
    setStartDate(dateRange ? dateRange[0] : '');
    setEndDate(dateRange ? dateRange[1] : '');
    // setNumberOfPeople(numberOfPeople);
    // setBudget(budget);
    resetLocalState(); // Reset local state
    router.push('/plan');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Section */}
      <section className="flex flex-1 relative">
        {/* Background GIF */}
        <div className="absolute inset-0 z-0">
          <img src="/giphy.webp" alt="Background" className="w-full h-full object-cover" />
        </div>

        <div className="w-full bg-gray-100 bg-opacity-75 flex flex-col items-center justify-center p-6 z-10">
          <p className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-800">
            Travel Planner와 함께 여행 일정을 짜보세요
          </p>
          <button
            className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-600 transition duration-300 text-lg md:text-2xl"
            onClick={toggleModal}
          >
            일정 만들기
          </button>
        </div>
      </section>

      {/* Location Picker Modal */}
      {isModalOpen && step === 1 && (
        <LocationPickerModal
          destination={destination}
          setDestination={setLocalDestination}
          onNext={handleNextStep}
          onClose={toggleModal}
        />
      )}

      {/* Date Picker Modal */}
      {isModalOpen && step === 2 && (
        <DatePickerModal
          dateRange={dateRange}
          setDateRange={setLocalDateRange}
          onClose={toggleModal}
          onNext={handleFinish}
          onPrevious={handlePreviousStep}
        />
      )}

      {/* People and Budget Modal 인원 및 예산관련 모달 */}
      {/* {isModalOpen && step === 3 && (
        <PeopleAndBudgetModal
          numberOfPeople={numberOfPeople}
          setNumberOfPeople={setLocalNumberOfPeople}
          budget={budget}
          setBudget={setLocalBudget}
          onClose={toggleModal}
          onNext={handleFinish}
          onPrevious={handlePreviousStep}
        />
      )} */}
    </div>
  );
}
