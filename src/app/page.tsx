'use client';

import { useState } from 'react';
import DatePickerModal from '@/containers/picker/datePicker';
import LocationPickerModal from '@/containers/picker/locationPicker';
import PeopleAndBudgetModal from '@/containers/picker/peopleAndBudgetPicker';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setStep(1); // Reset step when modal is closed
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
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
          onNext={handleNextStep}
          onClose={toggleModal}
        />
      )}

      {/* Date Picker Modal */}
      {isModalOpen && step === 2 && (
        <DatePickerModal
          onClose={toggleModal}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
        />
      )}

      {/* People and Budget Modal */}
      {isModalOpen && step === 3 && (
        <PeopleAndBudgetModal
          onClose={toggleModal}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
        />
      )}
    </div>
  );
}
