export interface TravelLocation {
    lat: number;
    lng: number;
    name: string;
    type: number;
    description: string;
    startTime: string;
    endTime: string;
}

export interface Route {
    from: string;
    to: string;
    method: number; // 1: 자동차, 2: 대중교통, 3: 도보
    time: string;
}

export interface TravelPlan {
    index: number;
    date: string;
    locations: TravelLocation[];
    routes: Route[];
}

export let travelPlanData: TravelPlan[] = [];

export default travelPlanData;
