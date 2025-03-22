export interface TravelLocation {
    lat: number;
    lng: number;
    name: string;
    type: number;
    description: string;
    country: string;
    startTime: string;
    endTime: string;
}

export interface Route {
    fromLocation: string;
    toLocation: string;
    method: number; // 1: 자동차, 2: 대중교통, 3: 도보
    time: string;
}

export interface TravelPlan {
    tripIndex: number;
    date: string;
    locations: TravelLocation[];
    routes: Route[];
}

// open api를 통해 받아온 데이터를 저장하는 변수
export let travelPlanData: TravelPlan[] = [];

export default travelPlanData;
