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
      // const response = [
      //   {
      //     "tripIndex": 0,
      //     "date": "2025-02-18",
      //     "routes": [
      //       {
      //         "method": 3,
      //         "fromLocation": "관서 지구",
      //         "time": "도보로 10분",
      //         "toLocation": "도톤보리"
      //       },
      //       {
      //         "method": 3,
      //         "fromLocation": "도톤보리",
      //         "time": "도보로 15분",
      //         "toLocation": "신사이바시 스시"
      //       },
      //       {
      //         "method": 3,
      //         "fromLocation": "신사이바시 스시",
      //         "time": "도보로 5분",
      //         "toLocation": "호텔 라 팤"
      //       }
      //     ],
      //     "locations": [
      //       {
      //         "lng": 135.5021651,
      //         "name": "관서 지구",
      //         "description": "오사카를 대표하는 번화가로 쇼핑 및 음식을 즐기기에 좋은 장소입니다.",
      //         "startTime": "09:00",
      //         "endTime": "12:00",
      //         "type": 1,
      //         "lat": 34.6937378
      //       },
      //       {
      //         "lng": 135.5013897,
      //         "name": "도톤보리",
      //         "description": "유명한 관광 명소로 식당과 상점이 밀집해있는 지역입니다.",
      //         "startTime": "13:00",
      //         "endTime": "16:00",
      //         "type": 1,
      //         "lat": 34.6937259
      //       },
      //       {
      //         "lng": 135.495558,
      //         "name": "신사이바시 스시",
      //         "description": "지역 주민들이 자주 찾는 맛집으로 신선한 회를 맛볼 수 있습니다.",
      //         "startTime": "18:00",
      //         "endTime": "19:30",
      //         "type": 2,
      //         "lat": 34.693837
      //       },
      //       {
      //         "lng": 135.4959928,
      //         "name": "호텔 라 팤",
      //         "description": "오사카에서 휴식을 취할 수 있는 편안한 숙박 시설입니다.",
      //         "startTime": "20:00",
      //         "endTime": "",
      //         "type": 3,
      //         "lat": 34.6949104
      //       }
      //     ]
      //   },
      //   {
      //     "tripIndex": 1,
      //     "date": "2025-02-19",
      //     "routes": [
      //       {
      //         "method": 2,
      //         "fromLocation": "도톤보리",
      //         "time": "지하철로 15분",
      //         "toLocation": "오사카 성"
      //       },
      //       {
      //         "method": 3,
      //         "fromLocation": "오사카 성",
      //         "time": "도보로 10분",
      //         "toLocation": "마루야마 파크"
      //       }
      //     ],
      //     "locations": [
      //       {
      //         "lng": 135.5013897,
      //         "name": "도톤보리",
      //         "description": "유명한 관광 명소로 식당과 상점이 밀집해있는 지역입니다.",
      //         "startTime": "09:00",
      //         "endTime": "12:00",
      //         "type": 1,
      //         "lat": 34.6937259
      //       },
      //       {
      //         "lng": 135.525548,
      //         "name": "오사카 성",
      //         "description": "일본 역사와 문화를 경험할 수 있는 오사카의 랜드마크입니다.",
      //         "startTime": "13:00",
      //         "endTime": "16:00",
      //         "type": 1,
      //         "lat": 34.687315
      //       },
      //       {
      //         "lng": 135.527655,
      //         "name": "마루야마 파크",
      //         "description": "자연 경관이 아름다운 공원으로 산책하기에 좋은 장소입니다.",
      //         "startTime": "16:30",
      //         "endTime": "18:00",
      //         "type": 1,
      //         "lat": 34.685295
      //       }
      //     ]
      //   }
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
