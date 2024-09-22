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
    day: string;
    locations: TravelLocation[];
    routes: Route[];
}

export let travelPlanData: TravelPlan[] = [
    {
      "routes": [
        {
          "method": 1,
          "from": "뉴어크 리버파크",
          "to": "브루클린 다리",
          "time": "1시간"
        },
        {
          "method": 2,
          "from": "브루클린 다리",
          "to": "브루클린 박물관",
          "time": "15분"
        },
        {
          "method": 2,
          "from": "브루클린 박물관",
          "to": "타임스퀘어",
          "time": "1시간"
        },
        {
          "method": 3,
          "from": "타임스퀘어",
          "to": "맨해튼 브리지",
          "time": "30분"
        }
      ],
      "index": 0,
      "locations": [
        {
          "lng": -74.2598758,
          "name": "뉴어크 리버파크",
          "description": "평화로운 공원",
          "startTime": "09:00",
          "endTime": "11:00",
          "type": 1,
          "lat": 40.6976701
        },
        {
          "lng": -74.0059413,
          "name": "브루클린 다리",
          "description": "유명한 다리",
          "startTime": "12:00",
          "endTime": "13:30",
          "type": 1,
          "lat": 40.7127837
        },
        {
          "lng": -73.979681,
          "name": "브루클린 박물관",
          "description": "문화 유산 전시",
          "startTime": "14:30",
          "endTime": "16:30",
          "type": 1,
          "lat": 40.7033127
        },
        {
          "lng": -73.985131,
          "name": "타임스퀘어",
          "description": "번화가와 광장",
          "startTime": "18:00",
          "endTime": "20:00",
          "type": 1,
          "lat": 40.758895
        },
        {
          "lng": -74.0059413,
          "name": "맨해튼 브리지",
          "description": "뉴욕을 대표하는 다리",
          "startTime": "21:00",
          "endTime": "22:00",
          "type": 1,
          "lat": 40.7127837
        }
      ],
      "day": "2024-09-24"
    },
    {
      "routes": [
        {
          "method": 2,
          "from": "타임스퀘어",
          "to": "센트럴 파크",
          "time": "20분"
        },
        {
          "method": 2,
          "from": "센트럴 파크",
          "to": "엠파이어 스테이트 빌딩",
          "time": "30분"
        },
        {
          "method": 1,
          "from": "엠파이어 스테이트 빌딩",
          "to": "프리덤 타워",
          "time": "20분"
        }
      ],
      "index": 1,
      "locations": [
        {
          "lng": -73.985131,
          "name": "타임스퀘어",
          "description": "번화가와 광장",
          "startTime": "09:00",
          "endTime": "11:00",
          "type": 1,
          "lat": 40.758895
        },
        {
          "lng": -73.9649157,
          "name": "센트럴 파크",
          "description": "뉴욕의 중심",
          "startTime": "12:00",
          "endTime": "14:00",
          "type": 1,
          "lat": 40.7687318
        },
        {
          "lng": -73.985428,
          "name": "엠파이어 스테이트 빌딩",
          "description": "유명한 랜드마크",
          "startTime": "15:00",
          "endTime": "17:00",
          "type": 1,
          "lat": 40.748817
        },
        {
          "lng": -74.0093557,
          "name": "프리덤 타워",
          "description": "9.11 기억탑",
          "startTime": "18:00",
          "endTime": "20:00",
          "type": 1,
          "lat": 40.7073249
        }
      ],
      "day": "2024-09-25"
    },
    {
      "routes": [{
        "method": 3,
        "from": "테네시 강",
        "to": "스탯튼 아일랜드 페리 터미널",
        "time": "1시간"
      }],
      "index": 2,
      "locations": [
        {
          "lng": -74.0059413,
          "name": "테네시 강",
          "description": "자유의 여신상이 위치한 강",
          "startTime": "10:00",
          "endTime": "12:00",
          "type": 1,
          "lat": 40.7127837
        },
        {
          "lng": -74.044502,
          "name": "스탯튼 아일랜드 페리 터미널",
          "description": "스탯튼 아일랜드로 가는 페리",
          "startTime": "13:00",
          "endTime": "14:30",
          "type": 1,
          "lat": 40.689247
        }
      ],
      "day": "2024-09-26"
    }
  ];

export default travelPlanData;
