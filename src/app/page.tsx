// pages/index.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePickerModal from '@/containers/picker/datePicker';
import LocationPickerModal from '@/containers/picker/locationPicker';
import { callTravelPlanAPI } from '@/services/travelPlan';
import { useTravelStore } from '@/store/useTravelStore';
import 'react-calendar/dist/Calendar.css';
import { travelPlanData, TravelPlan } from '@/data/travelPlanData';

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

  const handleFinish = async () => {
    setDestination(destination);
    setStartDate(dateRange ? dateRange[0] : '');
    setEndDate(dateRange ? dateRange[1] : '');
    resetLocalState(); // Reset local state

    const startDate = dateRange ? dateRange[0] : '';
    const endDate = dateRange ? dateRange[1] : '';

    const response = await callTravelPlanAPI(destination, startDate, endDate);

    try {
      // JSON 문자열을 객체로 변환
      const parsedData: TravelPlan[] = JSON.parse(response);

      // travelPlanData 배열을 비우고 새 데이터를 추가
      travelPlanData.length = 0; // 기존 배열 비우기
      travelPlanData.push(...parsedData); // 새 데이터를 배열에 추가

      console.log('Parsed travel plan data: ', travelPlanData);
    } catch (error) {
      console.error('JSON 파싱 실패: ', error);
    }

    router.push('/plan'); // 페이지 이동
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
    </div>
  );
}
