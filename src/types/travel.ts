/**
 * 여행 위치 정보
 */
export interface TravelLocation {
  name: string;
  lat: number;
  lng: number;
  type: number;
  description?: string;
  startTime: string;
  endTime: string;
  country?: string; // 원래 타입과 호환되도록 추가
}

/**
 * 여행 경로 정보
 */
export interface TravelRoute {
  fromLocation: string;
  toLocation: string;
  transportationType?: number; // 선택사항으로 변경
  method?: number; // 기존 타입과 호환을 위해 추가
  time?: string; // 기존 타입과 호환을 위해 추가
}

/**
 * 여행 일정 정보
 */
export interface TravelPlan {
  date: string;
  tripIndex: number;
  locations: TravelLocation[];
  routes: TravelRoute[];
}

/**
 * 저장할 여행 데이터
 */
export interface TravelPlanToSave {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  dates: TravelPlan[];
}

/**
 * 이벤트 핸들러 Props
 */
export interface LocationHandlerProps {
  onLocationMouseEnter: (location: TravelLocation) => void;
  onLocationMouseLeave: () => void;
  onLocationClick: (location: TravelLocation) => void;
}

export interface RouteHandlerProps {
  onRouteMouseEnter: (from: string, to: string) => void;
  onRouteMouseLeave: () => void;
  onRouteClick: (from: string, to: string) => void;
}
