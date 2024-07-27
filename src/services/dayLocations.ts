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

export interface DayLocations {
    day: string;
    locations: TravelLocation[];
    routes: Route[];
}

const dayLocations: DayLocations[] = [
    {
        day: '20240615',
        locations: [
            {
                lat: 35.116984,
                lng: 129.042415,
                name: '김해국제공항',
                type: 3,
                description: '부산 여행의 시작점',
                startTime: '09:00',
                endTime: '09:30',
            },
            {
                lat: 35.156461,
                lng: 129.059691,
                name: '해운대 해수욕장',
                type: 1,
                description: '부산의 대표 해수욕장',
                startTime: '10:00',
                endTime: '12:00',
            },
            {
                lat: 35.163133,
                lng: 129.163558,
                name: '동백섬',
                type: 1,
                description: '아름다운 경치를 자랑하는 섬',
                startTime: '12:30',
                endTime: '14:00',
            },
            {
                lat: 35.156812,
                lng: 129.144132,
                name: '센텀시티',
                type: 4,
                description: '쇼핑과 식사를 즐길 수 있는 곳',
                startTime: '14:30',
                endTime: '16:00',
            },
            {
                lat: 35.137922,
                lng: 129.100597,
                name: '광안리 해수욕장',
                type: 1,
                description: '야경이 아름다운 해수욕장',
                startTime: '16:30',
                endTime: '18:00',
            },
            {
                lat: 35.155018,
                lng: 129.059473,
                name: '파크 하얏트 부산',
                type: 3,
                description: '럭셔리 호텔',
                startTime: '18:30',
                endTime: '21:00',
            },
        ],
        routes: [
            {
                from: '김해국제공항',
                to: '해운대 해수욕장',
                method: 2,
                time: '30분',
            },
            {
                from: '해운대 해수욕장',
                to: '동백섬',
                method: 3,
                time: '15분',
            },
            {
                from: '동백섬',
                to: '센텀시티',
                method: 2,
                time: '15분',
            },
            {
                from: '센텀시티',
                to: '광안리 해수욕장',
                method: 2,
                time: '20분',
            },
            {
                from: '광안리 해수욕장',
                to: '파크 하얏트 부산',
                method: 2,
                time: '20분',
            },
        ],
    },
    {
        day: '20240616',
        locations: [
            {
                lat: 35.155018,
                lng: 129.059473,
                name: '파크 하얏트 부산',
                type: 3,
                description: '럭셔리 호텔',
                startTime: '09:00',
                endTime: '09:30',
            },
            {
                lat: 35.180168,
                lng: 129.074534,
                name: '태종대',
                type: 1,
                description: '부산의 대표 관광지',
                startTime: '10:00',
                endTime: '12:00',
            },
            {
                lat: 35.097562,
                lng: 129.033761,
                name: '자갈치 시장',
                type: 2,
                description: '신선한 해산물을 즐길 수 있는 시장',
                startTime: '12:30',
                endTime: '14:00',
            },
            {
                lat: 35.096471,
                lng: 129.036232,
                name: 'BIFF 광장',
                type: 1,
                description: '부산 국제 영화제가 열리는 광장',
                startTime: '14:30',
                endTime: '15:30',
            },
            {
                lat: 35.104593,
                lng: 129.032801,
                name: '부산 타워',
                type: 1,
                description: '부산 시내를 한눈에 볼 수 있는 타워',
                startTime: '16:00',
                endTime: '17:00',
            },
            {
                lat: 35.155018,
                lng: 129.059473,
                name: '파크 하얏트 부산',
                type: 3,
                description: '럭셔리 호텔',
                startTime: '17:30',
                endTime: '21:00',
            },
        ],
        routes: [
            {
                from: '파크 하얏트 부산',
                to: '태종대',
                method: 2,
                time: '30분',
            },
            {
                from: '태종대',
                to: '자갈치 시장',
                method: 2,
                time: '30분',
            },
            {
                from: '자갈치 시장',
                to: 'BIFF 광장',
                method: 3,
                time: '10분',
            },
            {
                from: 'BIFF 광장',
                to: '부산 타워',
                method: 3,
                time: '10분',
            },
            {
                from: '부산 타워',
                to: '파크 하얏트 부산',
                method: 2,
                time: '30분',
            },
        ],
    },
    {
        day: '20240617',
        locations: [
            {
                lat: 35.155018,
                lng: 129.059473,
                name: '파크 하얏트 부산',
                type: 3,
                description: '럭셔리 호텔',
                startTime: '09:00',
                endTime: '09:30',
            },
            {
                lat: 35.117212,
                lng: 129.033705,
                name: '용두산 공원',
                type: 1,
                description: '부산 시내를 한눈에 볼 수 있는 공원',
                startTime: '10:00',
                endTime: '11:00',
            },
            {
                lat: 35.179981,
                lng: 129.075103,
                name: '태종대 전망대',
                type: 1,
                description: '아름다운 해안 절경을 감상할 수 있는 곳',
                startTime: '11:30',
                endTime: '12:30',
            },
            {
                lat: 35.155978,
                lng: 129.129682,
                name: '해운대 달맞이길',
                type: 1,
                description: '경치가 아름다운 드라이브 코스',
                startTime: '13:00',
                endTime: '14:00',
            },
            {
                lat: 35.155018,
                lng: 129.059473,
                name: '파크 하얏트 부산',
                type: 3,
                description: '호텔로 돌아가 휴식',
                startTime: '14:30',
                endTime: '15:30',
            },
            {
                lat: 35.116984,
                lng: 129.042415,
                name: '김해국제공항',
                type: 3,
                description: '부산 여행의 마무리',
                startTime: '16:00',
                endTime: '17:00',
            },
        ],
        routes: [
            {
                from: '파크 하얏트 부산',
                to: '용두산 공원',
                method: 2,
                time: '20분',
            },
            {
                from: '용두산 공원',
                to: '태종대 전망대',
                method: 2,
                time: '30분',
            },
            {
                from: '태종대 전망대',
                to: '해운대 달맞이길',
                method: 2,
                time: '30분',
            },
            {
                from: '해운대 달맞이길',
                to: '파크 하얏트 부산',
                method: 2,
                time: '15분',
            },
            {
                from: '파크 하얏트 부산',
                to: '김해국제공항',
                method: 2,
                time: '30분',
            },
        ],
    },
];

export default dayLocations;
