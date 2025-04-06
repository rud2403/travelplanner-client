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
}

/**
 * 여행 경로 정보
 */
export interface TravelRoute {
  fromLocation: string;
  toLocation: string;
  transportationType: number;
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
