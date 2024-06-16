'use client';

import { useState } from 'react';
import DatePickerModal from '@/components/Modal/datePickerModal';
import LocationPickerModal from '@/components/Modal/locationPickerModal';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [step, setStep] = useState(1);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setStep(1); // Reset step when modal is closed
    setStartDate(null);
    setEndDate(null);
    setDateRange(null);
    setDeparture('');
    setArrival('');
  };

  const handleDateChange = (range: [Date, Date]) => {
    setDateRange(range);
    setStartDate(range[0]);
    setEndDate(range[1]);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
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
          departure={departure}
          arrival={arrival}
          setDeparture={setDeparture}
          setArrival={setArrival}
          onClose={toggleModal}
          onNext={handleNextStep}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {/* Date Picker Modal */}
      {isModalOpen && step === 2 && (
        <DatePickerModal
          currentDate={currentDate}
          dateRange={dateRange}
          onDateChange={handleDateChange}
          onMonthChange={handleMonthChange}
          onClose={toggleModal}
          onNext={() => alert('여행 계획이 완료되었습니다!')}
        />
      )}
    </div>
  );
}
