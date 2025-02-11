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

import styles from './page.module.css'; // CSS 모듈 가져오기

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
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

  // 여행 정보 저장 및 백단으로부터 AI 여행일정 데이터 가져오기
  const handleFinish = async () => {
    setIsLoading(true); // 로딩 상태 시작
    setDestination(destination);
    setStartDate(dateRange ? dateRange[0] : '');
    setEndDate(dateRange ? dateRange[1] : '');
    resetLocalState(); // Reset local state

    const startDate = dateRange ? dateRange[0] : '';
    const endDate = dateRange ? dateRange[1] : '';

    try {
      const response = await callTravelPlanAPI(destination, startDate, endDate);

      // API 호출 대신 로컬 데이터 사용
    //   const response = [
    //     {
    //         "id": 1,
    //         "tripId": 1,
    //         "date": "2025-01-13",
    //         "tripIndex": 0,
    //         "routes": [
    //             {
    //                 "id": 1,
    //                 "dateId": 1,
    //                 "method": 2,
    //                 "fromLocation": "호텔",
    //                 "toLocation": "오사카성",
    //                 "time": "30분"
    //             },
    //             {
    //                 "id": 2,
    //                 "dateId": 1,
    //                 "method": 2,
    //                 "fromLocation": "오사카성",
    //                 "toLocation": "오사카 수족관",
    //                 "time": "40분"
    //             },
    //             {
    //                 "id": 3,
    //                 "dateId": 1,
    //                 "method": 3,
    //                 "fromLocation": "오사카 수족관",
    //                 "toLocation": "도톤보리 거리",
    //                 "time": "30분"
    //             }
    //         ],
    //         "locations": [
    //             {
    //                 "id": 1,
    //                 "dateId": 1,
    //                 "name": "오사카성",
    //                 "description": "오사카를 대표하는 랜드마크인 오사카성을 도보로 방문합니다.",
    //                 "lat": 34.6937378,
    //                 "lng": 135.5021651,
    //                 "startTime": "09:00",
    //                 "endTime": "11:00",
    //                 "type": 1
    //             },
    //             {
    //                 "id": 2,
    //                 "dateId": 1,
    //                 "name": "오사카 수족관",
    //                 "description": "다양한 해양 생물을 관찰할 수 있는 오사카 수족관을 관람합니다.",
    //                 "lat": 34.687315,
    //                 "lng": 135.526201,
    //                 "startTime": "13:00",
    //                 "endTime": "15:00",
    //                 "type": 1
    //             },
    //             {
    //                 "id": 3,
    //                 "dateId": 1,
    //                 "name": "도톤보리 거리",
    //                 "description": "도톤보리 거리에서 오사카의 번화가와 맛집을 즐깁니다.",
    //                 "lat": 34.6654427,
    //                 "lng": 135.4323384,
    //                 "startTime": "17:00",
    //                 "endTime": "20:00",
    //                 "type": 1
    //             }
    //         ]
    //     },
    //     {
    //         "id": 2,
    //         "tripId": 1,
    //         "date": "2025-01-14",
    //         "tripIndex": 1,
    //         "routes": [
    //             {
    //                 "id": 4,
    //                 "dateId": 2,
    //                 "method": 2,
    //                 "fromLocation": "호텔",
    //                 "toLocation": "신오사카 역",
    //                 "time": "20분"
    //             }
    //         ],
    //         "locations": [
    //             {
    //                 "id": 4,
    //                 "dateId": 2,
    //                 "name": "오사카 아쿠아 리비エ라 호텔 체크아웃",
    //                 "description": "오사카에서 아름다운 풍경을 감상할 수 있는 아쿠아 리비에라 호텔에서 체크아웃합니다.",
    //                 "lat": 34.6937382,
    //                 "lng": 135.5021651,
    //                 "startTime": "10:00",
    //                 "endTime": "10:30",
    //                 "type": 3
    //             },
    //             {
    //                 "id": 5,
    //                 "dateId": 2,
    //                 "name": "신오사카 (Shin-Osaka) 역",
    //                 "description": "신오사카 역에서 나라 역으로 이동합니다.",
    //                 "lat": 34.702485,
    //                 "lng": 135.495951,
    //                 "startTime": "11:00",
    //                 "endTime": "11:30",
    //                 "type": 3
    //             }
    //         ]
    //     }
    // ]

      console.log('Response from API: ', response);

      // JSON 문자열을 객체로 변환
      // const parsedData: TravelPlan[] = JSON.parse(response);

      // travelPlanData 배열을 비우고 새 데이터를 추가
      travelPlanData.length = 0; // 기존 배열 비우기
      // travelPlanData.push(...parsedData); // 새 데이터를 배열에 추가
      travelPlanData.push(...response); // 새 데이터를 배열에 추가

      console.log('Parsed travel plan data: ', travelPlanData);
      router.push('/plan'); // 페이지 이동
    } catch (error) {
      console.error('JSON 파싱 실패: ', error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
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

      {/* 로딩 팝업 */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              여행 일정을 준비 중입니다.
            </p>
            {/* 점 3개 순서대로 점프하는 애니메이션 */}
            <div className="flex space-x-2 mt-2">
              <div className={`w-4 h-4 bg-blue-500 rounded-full ${styles['animate-bounce-custom']} ${styles['dot-1']}`}></div>
              <div className={`w-4 h-4 bg-blue-500 rounded-full ${styles['animate-bounce-custom']} ${styles['dot-2']}`}></div>
              <div className={`w-4 h-4 bg-blue-500 rounded-full ${styles['animate-bounce-custom']} ${styles['dot-3']}`}></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              잠시만 기다려 주세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
