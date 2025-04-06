import { TravelLocation, TravelRoute, TravelPlan } from '@/types/travel';

// route의 메소드와 transportationType 호환을 위한 포인트
type ModifiedRoute = {
    fromLocation: string;
    toLocation: string;
    method: number;
    time: string;
};

// 원래 Route 타입을 TravelRoute로 변환하는 함수
export function convertRouteToTravelRoute(route: ModifiedRoute): TravelRoute {
    return {
        fromLocation: route.fromLocation,
        toLocation: route.toLocation,
        transportationType: route.method,
        method: route.method,
        time: route.time
    };
}

// open api를 통해 받아온 데이터를 저장하는 변수
export let travelPlanData: TravelPlan[] = [];

export default travelPlanData;
