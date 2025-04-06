import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TravelPlan, TravelLocation, TravelRoute } from '@/types/travel';

/**
 * 여행 애플리케이션의 전역 상태 타입
 */
interface TravelState {
  // 여행 기본 정보
  id: number;
  destination: string;
  country: string;
  description: string;
  startDate: string;
  endDate: string;
  
  // 여행 일정 데이터
  dateLocations: TravelPlan[];
  selectedDate: number | null;
  focusedLocation: TravelLocation | null;
  focusedRoute: TravelRoute | null;
  
  // UI 데이터
  colors: string[];
  
  // 액션 메서드
  setId: (id: number) => void;
  setDestination: (destination: string) => void;
  setCountry: (country: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setDateLocations: (dateLocations: TravelPlan[]) => void;
  setSelectedDate: (date: number | null) => void;
  setFocusedLocation: (location: TravelLocation | null) => void;
  setFocusedRoute: (route: TravelRoute | null) => void;
  resetState: () => void;
}

/**
 * 여행 앱의 기본 색상 팔레트
 */
const DEFAULT_COLORS = [
  '#FF5733', // 주황
  '#33C1FF', // 하늘
  '#33FF57', // 민트
  '#FFC133', // 노랑
  '#C133FF', // 보라
  '#FF33A6', // 핑크
  '#33FFD1', // 청록
  '#FF8F33', // 주황2
  '#33FF8F', // 연두
  '#8F33FF'  // 진보라
];

/**
 * 기본 상태 값
 */
const DEFAULT_STATE = {
  id: 0,
  destination: '',
  country: '',
  description: '',
  startDate: '',
  endDate: '',
  dateLocations: [],
  selectedDate: null,
  focusedLocation: null,
  focusedRoute: null,
  colors: DEFAULT_COLORS,
};

/**
 * 여행 전역 상태 관리를 위한 Zustand 스토어
 */
export const useTravelStore = create<TravelState>()(
  devtools((set) => ({
    ...DEFAULT_STATE,
    
    // 상태 업데이트 액션
    setId: (id) => set({ id }),
    setDestination: (destination) => set({ destination }),
    setCountry: (country) => set({ country }),
    setDescription: (description) => set({ description }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setDateLocations: (dateLocations) => set({ dateLocations }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setFocusedLocation: (location) => set({ focusedLocation: location }),
    setFocusedRoute: (route) => set({ focusedRoute: route }),
    
    // 상태 초기화
    resetState: () => set(DEFAULT_STATE),
  }), 
  {
    name: 'travel-store', // 개발 도구에서 표시될 스토어 이름
  })
);
