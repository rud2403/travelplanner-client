// pages/index.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePickerModal from '@/containers/picker/datePicker';
import LocationPickerModal from '@/containers/picker/locationPicker';
import { callTravelPlanAPI } from '@/services/travelPlan';
import { useTravelStore } from '@/store/useTravelStore';
import 'react-calendar/dist/Calendar.css';
import { EMPTY_TRAVEL_PLAN } from '@/data/travelPlanData';
import { countryCodes } from '@/data/travelLocations';

import styles from './page.module.css'; // CSS 모듈 가져오기

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  const {
    resetState,
    setId,
    setDestination,
    setCountry,
    setStartDate,
    setEndDate,
    setDateLocations,
    // setNumberOfPeople,
    // setBudget,
  } = useTravelStore();

  const [destination, setLocalDestination] = useState('');
  const [dateRange, setLocalDateRange] = useState<[string, string] | null>(null);
  // const [numberOfPeople, setLocalNumberOfPeople] = useState(1);
  // const [budget, setLocalBudget] = useState(0);

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
    // setLocalNumberOfPeople(1);
    // setLocalBudget(0);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // 모달 마지막 단계에서 호출되는 함수
  const handleFinish = async () => {
    setIsLoading(true); // 로딩 상태 시작
    
    // Zustand 스토어에 여행 기본 정보 저장
    setId(0); // 여행일정 생성임을 나타내기위해 id를 0으로 설정
    setDestination(destination);
    setCountry(countryCodes[destination.split(' - ')[0]]); // 국가 코드 설정
    
    const startDateValue = dateRange ? dateRange[0] : '';
    const endDateValue = dateRange ? dateRange[1] : '';
    
    setStartDate(startDateValue);
    setEndDate(endDateValue);
    
    resetLocalState(); // Reset local state

    try {
      // API 호출하여 여행 계획 데이터 가져오기
      const response = await callTravelPlanAPI(destination, startDateValue, endDateValue);
      console.log('Response from API: ', response);
      
      // Zustand 스토어에 여행 계획 데이터 저장
      setDateLocations(response);
      
      console.log('여행 계획 데이터가 스토어에 저장되었습니다.');
      
      // 여행 계획 페이지로 이동
      router.push('/plan');
    } catch (error) {
      console.error('여행 계획 생성 실패: ', error);
      alert('여행 계획을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Section */}
      <section className="flex flex-1 relative overflow-hidden">
        {/* Background GIF with lighter overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-gray-100/70 z-10"></div>
          <img src="/giphy.webp" alt="Background" className="w-full h-full object-cover filter brightness-105" />
        </div>

        <div className="w-full flex flex-col items-center justify-center p-6 z-10">
          <p className="text-4xl md:text-6xl font-bold mb-6 text-center text-gray-800">
            Travel Planner와 함께<br />
            <span className="text-blue-600">여행 일정</span>을 짜보세요
          </p>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl text-center">
            AI가 추천하는 최적의 여행 일정으로 더 즐거운 여행을 경험해 보세요
          </p>
          <button
            className="bg-blue-500 text-white font-bold py-4 px-10 rounded-full hover:bg-blue-600 transition-all duration-300 text-lg md:text-2xl shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
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

      {/* 로딩 팝업 */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center border border-gray-200">
            <p className="text-2xl font-bold text-blue-600 mb-4">
              여행 일정을 준비 중입니다
            </p>
            {/* 개선된 애니메이션 */}
            <div className="flex space-x-3 my-4">
              <div className={`w-4 h-4 bg-blue-600 rounded-full ${styles['animate-bounce-custom']} ${styles['dot-1']}`}></div>
              <div className={`w-4 h-4 bg-blue-500 rounded-full ${styles['animate-bounce-custom']} ${styles['dot-2']}`}></div>
              <div className={`w-4 h-4 bg-blue-400 rounded-full ${styles['animate-bounce-custom']} ${styles['dot-3']}`}></div>
            </div>
            <p className="text-gray-600 text-center mt-2 max-w-sm">
              AI가 최적의 여행 일정을 생성하고 있습니다.<br />잠시만 기다려 주세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
