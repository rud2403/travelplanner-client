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
    index: number;
    day: string;
    locations: TravelLocation[];
    routes: Route[];
}

const dayLocations: DayLocations[] = [
    {
        "index": 0,
        "day": "20240615",
        "locations": [
            {
                "lat": 34.6937378,
                "lng": 135.5021651,
                "name": "오사카역",
                "type": 1,
                "description": "오사카 중심부에 위치한 주요 기차역",
                "startTime": "09:00",
                "endTime": "09:30"
            },
            {
                "lat": 34.669349,
                "lng": 135.506306,
                "name": "신사이바시 쇼핑 아케이드",
                "type": 4,
                "description": "오사카의 유명한 쇼핑 거리",
                "startTime": "10:00",
                "endTime": "12:00"
            },
            {
                "lat": 34.668738,
                "lng": 135.501421,
                "name": "이치란 라멘 도톤보리점",
                "type": 2,
                "description": "유명한 라멘 체인점에서 점심 식사",
                "startTime": "12:30",
                "endTime": "13:30"
            },
            {
                "lat": 34.705338,
                "lng": 135.490059,
                "name": "우메다 스카이 빌딩",
                "type": 1,
                "description": "도시의 멋진 전망을 즐길 수 있는 빌딩",
                "startTime": "14:00",
                "endTime": "15:30"
            },
            {
                "lat": 34.667488,
                "lng": 135.430238,
                "name": "유니버셜 스튜디오 재팬",
                "type": 1,
                "description": "유명한 테마 파크",
                "startTime": "16:00",
                "endTime": "20:00"
            },
            {
                "lat": 34.662539,
                "lng": 135.506732,
                "name": "호텔 마이스테이스 신사이바시",
                "type": 3,
                "description": "편안한 숙소",
                "startTime": "21:00",
                "endTime": "22:00"
            }
        ],
        "routes": [
            {
                "from": "오사카역",
                "to": "신사이바시 쇼핑 아케이드",
                "method": 2,
                "time": "15분"
            },
            {
                "from": "신사이바시 쇼핑 아케이드",
                "to": "이치란 라멘 도톤보리점",
                "method": 3,
                "time": "10분"
            },
            {
                "from": "이치란 라멘 도톤보리점",
                "to": "우메다 스카이 빌딩",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "우메다 스카이 빌딩",
                "to": "유니버셜 스튜디오 재팬",
                "method": 2,
                "time": "30분"
            },
            {
                "from": "유니버셜 스튜디오 재팬",
                "to": "호텔 마이스테이스 신사이바시",
                "method": 2,
                "time": "30분"
            }
        ]
    },
    {
        "index": 1,
        "day": "20240616",
        "locations": [
            {
                "lat": 34.662539,
                "lng": 135.506732,
                "name": "호텔 마이스테이스 신사이바시",
                "type": 3,
                "description": "편안한 숙소",
                "startTime": "09:00",
                "endTime": "09:30"
            },
            {
                "lat": 34.654518,
                "lng": 135.506225,
                "name": "덴노지 동물원",
                "type": 1,
                "description": "다양한 동물을 볼 수 있는 동물원",
                "startTime": "10:00",
                "endTime": "12:00"
            },
            {
                "lat": 34.665442,
                "lng": 135.513223,
                "name": "미도스지 라멘",
                "type": 2,
                "description": "점심 식사",
                "startTime": "12:30",
                "endTime": "13:30"
            },
            {
                "lat": 34.661346,
                "lng": 135.520005,
                "name": "시텐노지",
                "type": 1,
                "description": "오사카의 유명한 절",
                "startTime": "14:00",
                "endTime": "15:00"
            },
            {
                "lat": 34.666577,
                "lng": 135.495953,
                "name": "난바 파크스",
                "type": 4,
                "description": "쇼핑과 식사를 즐길 수 있는 복합 단지",
                "startTime": "16:00",
                "endTime": "18:00"
            },
            {
                "lat": 34.662539,
                "lng": 135.506732,
                "name": "호텔 마이스테이스 신사이바시",
                "type": 3,
                "description": "편안한 숙소",
                "startTime": "18:30",
                "endTime": "22:00"
            }
        ],
        "routes": [
            {
                "from": "호텔 마이스테이스 신사이바시",
                "to": "덴노지 동물원",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "덴노지 동물원",
                "to": "미도스지 라멘",
                "method": 2,
                "time": "10분"
            },
            {
                "from": "미도스지 라멘",
                "to": "시텐노지",
                "method": 2,
                "time": "10분"
            },
            {
                "from": "시텐노지",
                "to": "난바 파크스",
                "method": 2,
                "time": "10분"
            },
            {
                "from": "난바 파크스",
                "to": "호텔 마이스테이스 신사이바시",
                "method": 2,
                "time": "15분"
            }
        ]
    },
    {
        "index": 2,
        "day": "20240617",
        "locations": [
            {
                "lat": 34.662539,
                "lng": 135.506732,
                "name": "호텔 마이스테이스 신사이바시",
                "type": 3,
                "description": "편안한 숙소",
                "startTime": "09:00",
                "endTime": "09:30"
            },
            {
                "lat": 34.687316,
                "lng": 135.525318,
                "name": "오사카 성",
                "type": 1,
                "description": "역사적인 성과 아름다운 정원",
                "startTime": "10:00",
                "endTime": "12:00"
            },
            {
                "lat": 34.684237,
                "lng": 135.519846,
                "name": "스시잔마이",
                "type": 2,
                "description": "맛있는 스시를 즐길 수 있는 곳",
                "startTime": "12:30",
                "endTime": "13:30"
            },
            {
                "lat": 34.652497,
                "lng": 135.510400,
                "name": "신세카이",
                "type": 1,
                "description": "오사카의 전통적인 분위기를 느낄 수 있는 곳",
                "startTime": "14:00",
                "endTime": "16:00"
            },
            {
                "lat": 34.6937378,
                "lng": 135.5021651,
                "name": "오사카역",
                "type": 1,
                "description": "여행의 마지막 목적지",
                "startTime": "17:00",
                "endTime": "18:00"
            }
        ],
        "routes": [
            {
                "from": "호텔 마이스테이스 신사이바시",
                "to": "오사카 성",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "오사카 성",
                "to": "스시잔마이",
                "method": 2,
                "time": "10분"
            },
            {
                "from": "스시잔마이",
                "to": "신세카이",
                "method": 2,
                "time": "20분"
            },
            {
                "from": "신세카이",
                "to": "오사카역",
                "method": 2,
                "time": "20분"
            }
        ]
    }
];

export default dayLocations;
