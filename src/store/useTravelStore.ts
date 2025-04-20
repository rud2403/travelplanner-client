import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TravelPlan, TravelLocation, TravelRoute } from '@/types/travel';

// 위치 만 불변성을 가진 댓기 함수 정의
const immerSet = <T extends object>(
  obj: T,
  updater: (draft: T) => void
): T => {
  // 1. 불변성을 위해 기존 객체를 딥 복사
  const newObj = JSON.parse(JSON.stringify(obj));
  
  // 2. 업데이터 함수 적용
  updater(newObj);
  
  // 3. 변경된 객체 반환
  return newObj;
};

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
  tempSelectedLocation: TravelLocation | null; // 임시 위치 선택 저장용
  
  // UI 데이터
  colors: string[];
  preservedSelectedDate: number | null; // 일차 선택 유지를 위한 별도 변수
  
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
  setTempSelectedLocation: (location: TravelLocation | null) => void; // 임시 위치 설정
  setPreservedSelectedDate: (date: number | null) => void; // 임시 저장된 일차 정보 설정
  resetState: () => void;
  resetLocationState: () => void; // 새로 추가: 위치 관련 상태만 초기화
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
  tempSelectedLocation: null, // 임시 위치 초기값
  preservedSelectedDate: null, // 임시 일차 정보 초기값
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
    setTempSelectedLocation: (location) => set({ tempSelectedLocation: location }),
    setPreservedSelectedDate: (date) => set({ preservedSelectedDate: date }),
    
    // 상태 초기화
    resetState: () => set(DEFAULT_STATE),
    
    // 위치 관련 상태만 초기화 - 변경을 최소화하여 무한 업데이트 방지
    resetLocationState: () => {
      // 이전 상태의 현재 값을 가져옴
      const { focusedLocation, focusedRoute, tempSelectedLocation } = useTravelStore.getState();
      
      // 변경이 필요한 경우에만 업데이트 수행 - 동그랑 진입 방지
      if (focusedLocation !== null || focusedRoute !== null || tempSelectedLocation !== null) {
        // 이미 null이 아닌 값만 선택적으로 초기화
        const updates: Record<string, null> = {};
        
        if (focusedLocation !== null) updates.focusedLocation = null;
        if (focusedRoute !== null) updates.focusedRoute = null;
        if (tempSelectedLocation !== null) updates.tempSelectedLocation = null;
        
        // 변경이 필요한 경우에만 set 호출 - 변경 사항이 없으면 호출하지 않음
        if (Object.keys(updates).length > 0) {
          console.log('위치 관련 상태 초기화:', updates);
          set(updates, false, 'resetLocationState');
        } else {
          console.log('변경 필요 없음 - 업데이트 건너뜀');
        }
      }
    }
  }), 
  {
    name: 'travel-store', // 개발 도구에서 표시될 스토어 이름
  })
);
