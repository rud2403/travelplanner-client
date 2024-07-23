export interface TravelLocation {
    lat: number;
    lng: number;
    name: string;
    type: number;
    description: string;
    startTime: string;
    endTime: string;
    budget: number;
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
    daily_budget: number;
}

const dayLocations: DayLocations[] = [
    {
        "day": "20240615",
        "locations": [
            {
                "lat": 34.693738,
                "lng": 135.502165,
                "name": "Osaka Castle",
                "type": 1,
                "description": "오사카 성 방문",
                "startTime": "10:00",
                "endTime": "11:30",
                "budget": 600
            },
            {
                "lat": 34.705338,
                "lng": 135.490059,
                "name": "Umeda Sky Building",
                "type": 1,
                "description": "우메다 스카이 빌딩",
                "startTime": "12:00",
                "endTime": "13:30",
                "budget": 1500
            },
            {
                "lat": 34.668859,
                "lng": 135.501452,
                "name": "Dotonbori",
                "type": 2,
                "description": "도톤보리에서 점심 식사",
                "startTime": "14:00",
                "endTime": "15:30",
                "budget": 2000
            },
            {
                "lat": 34.667488,
                "lng": 135.430238,
                "name": "Universal Studios Japan",
                "type": 1,
                "description": "유니버설 스튜디오 재팬",
                "startTime": "16:00",
                "endTime": "20:00",
                "budget": 8000
            },
            {
                "lat": 34.652497,
                "lng": 135.510400,
                "name": "Shinsekai",
                "type": 2,
                "description": "신세카이에서 저녁 식사",
                "startTime": "20:30",
                "endTime": "22:00",
                "budget": 3000
            },
            {
                "lat": 34.693738,
                "lng": 135.502165,
                "name": "Hotel",
                "type": 3,
                "description": "호텔 체크인",
                "startTime": "22:30",
                "endTime": "23:00",
                "budget": 10000
            }
        ],
        "routes": [
            {
                "from": "Osaka Castle",
                "to": "Umeda Sky Building",
                "method": 2,
                "time": "15분"
            },
            {
                "from": "Umeda Sky Building",
                "to": "Dotonbori",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Dotonbori",
                "to": "Universal Studios Japan",
                "method": 2,
                "time": "30분"
            },
            {
                "from": "Universal Studios Japan",
                "to": "Shinsekai",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Shinsekai",
                "to": "Hotel",
                "method": 2,
                "time": "15분"
            }
        ],
        "daily_budget": 27400
    },
    {
        "day": "20240616",
        "locations": [
            {
                "lat": 34.654518,
                "lng": 135.506225,
                "name": "Tennoji Zoo",
                "type": 1,
                "description": "덴노지 동물원",
                "startTime": "09:00",
                "endTime": "11:00",
                "budget": 500
            },
            {
                "lat": 34.661346,
                "lng": 135.520005,
                "name": "Shitennoji",
                "type": 1,
                "description": "시텐노지",
                "startTime": "11:30",
                "endTime": "12:30",
                "budget": 300
            },
            {
                "lat": 34.664914,
                "lng": 135.506899,
                "name": "Kuromon Ichiba Market",
                "type": 2,
                "description": "구로몬 시장에서 점심 식사",
                "startTime": "13:00",
                "endTime": "14:30",
                "budget": 2500
            },
            {
                "lat": 34.699881,
                "lng": 135.493063,
                "name": "Osaka Museum of Housing and Living",
                "type": 1,
                "description": "오사카 주택 및 생활 박물관",
                "startTime": "15:00",
                "endTime": "17:00",
                "budget": 600
            },
            {
                "lat": 34.702485,
                "lng": 135.495951,
                "name": "Hep Five",
                "type": 2,
                "description": "Hep Five에서 저녁 식사",
                "startTime": "17:30",
                "endTime": "19:00",
                "budget": 3500
            },
            {
                "lat": 34.693738,
                "lng": 135.502165,
                "name": "Hotel",
                "type": 3,
                "description": "호텔로 복귀",
                "startTime": "19:30",
                "endTime": "20:00",
                "budget": 10000
            }
        ],
        "routes": [
            {
                "from": "Hotel",
                "to": "Tennoji Zoo",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Tennoji Zoo",
                "to": "Shitennoji",
                "method": 3,
                "time": "10분"
            },
            {
                "from": "Shitennoji",
                "to": "Kuromon Ichiba Market",
                "method": 2,
                "time": "15분"
            },
            {
                "from": "Kuromon Ichiba Market",
                "to": "Osaka Museum of Housing and Living",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Osaka Museum of Housing and Living",
                "to": "Hep Five",
                "method": 3,
                "time": "5분"
            },
            {
                "from": "Hep Five",
                "to": "Hotel",
                "method": 2,
                "time": "10분"
            }
        ],
        "daily_budget": 17400
    },
    {
        "day": "20240617",
        "locations": [
            {
                "lat": 34.693738,
                "lng": 135.502165,
                "name": "Hotel",
                "type": 3,
                "description": "호텔 체크아웃",
                "startTime": "09:00",
                "endTime": "09:30",
                "budget": 10000
            },
            {
                "lat": 34.707152,
                "lng": 135.497315,
                "name": "Osaka Aquarium Kaiyukan",
                "type": 1,
                "description": "오사카 아쿠아리움",
                "startTime": "10:00",
                "endTime": "12:00",
                "budget": 2300
            },
            {
                "lat": 34.669271,
                "lng": 135.500290,
                "name": "Shinsaibashi",
                "type": 4,
                "description": "신사이바시 쇼핑",
                "startTime": "13:00",
                "endTime": "15:00",
                "budget": 5000
            },
            {
                "lat": 34.694349,
                "lng": 135.502835,
                "name": "Tsutenkaku",
                "type": 1,
                "description": "쓰텐카쿠 타워",
                "startTime": "15:30",
                "endTime": "17:00",
                "budget": 800
            },
            {
                "lat": 34.703206,
                "lng": 135.495911,
                "name": "Hankyu Umeda Main Store",
                "type": 2,
                "description": "한큐 우메다에서 마지막 식사",
                "startTime": "17:30",
                "endTime": "19:00",
                "budget": 4000
            },
            {
                "lat": 34.691290,
                "lng": 135.492053,
                "name": "Osaka Station",
                "type": 1,
                "description": "오사카 역에서 출발",
                "startTime": "19:30",
                "endTime": "20:00",
                "budget": 0
            }
        ],
        "routes": [
            {
                "from": "Hotel",
                "to": "Osaka Aquarium Kaiyukan",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Osaka Aquarium Kaiyukan",
                "to": "Shinsaibashi",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Shinsaibashi",
                "to": "Tsutenkaku",
                "method": 2,
                "time": "15분"
            },
            {
                "from": "Tsutenkaku",
                "to": "Hankyu Umeda Main Store",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "Hankyu Umeda Main Store",
                "to": "Osaka Station",
                "method": 3,
                "time": "5분"
            }
        ],
        "daily_budget": 22100
    },
];

export default dayLocations;
