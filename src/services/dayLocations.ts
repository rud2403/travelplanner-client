export interface TravelLocation {
    lat: number;
    lng: number;
    name: string;
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
    day: number;
    locations: TravelLocation[];
    routes: Route[];
  }
  
  const dayLocations: DayLocations[] = [
    {
      day: 1,
      locations: [
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)', startTime: '09:00', endTime: '09:30' },
        { lat: 34.705338, lng: 135.490059, name: 'Umeda Sky Building', description: '우메다 스카이 빌딩', startTime: '10:00', endTime: '11:30' },
        { lat: 34.667488, lng: 135.430238, name: 'Universal Studios Japan', description: '유니버설 스튜디오 재팬', startTime: '11:30', endTime: '14:00' },
        { lat: 34.652497, lng: 135.510400, name: 'Shinsekai', description: '신세카이', startTime: '15:00', endTime: '16:00' },
        { lat: 34.669271, lng: 135.500290, name: 'Dotonbori', description: '도톤보리', startTime: '17:00', endTime: '18:00' },
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)', startTime: '19:00', endTime: '21:00' },
      ],
      routes: [
        { from: 'Osaka Castle', to: 'Umeda Sky Building', method: 2, time: '15분' },
        { from: 'Umeda Sky Building', to: 'Universal Studios Japan', method: 2, time: '30분' },
        { from: 'Universal Studios Japan', to: 'Shinsekai', method: 1, time: '20분' },
        { from: 'Shinsekai', to: 'Dotonbori', method: 3, time: '10분' },
        { from: 'Dotonbori', to: 'Osaka Castle', method: 2, time: '25분' },
      ],
    },
    {
      day: 2,
      locations: [
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)', startTime: '09:00', endTime: '09:30' },
        { lat: 34.654518, lng: 135.506225, name: 'Tennoji Zoo', description: '덴노지 동물원', startTime: '10:00', endTime: '11:30' },
        { lat: 34.661346, lng: 135.520005, name: 'Shitennoji', description: '시텐노지', startTime: '12:00', endTime: '13:00' },
        { lat: 34.666577, lng: 135.495953, name: 'Namba Parks', description: '난바 파크스', startTime: '14:00', endTime: '15:00' },
        { lat: 34.705775, lng: 135.494911, name: 'Grand Front Osaka', description: '그랜드 프론트 오사카', startTime: '16:00', endTime: '17:00' },
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)', startTime: '18:00', endTime: '21:00' },
      ],
      routes: [
        { from: 'Osaka Castle', to: 'Tennoji Zoo', method: 2, time: '20분' },
        { from: 'Tennoji Zoo', to: 'Shitennoji', method: 3, time: '10분' },
        { from: 'Shitennoji', to: 'Namba Parks', method: 2, time: '15분' },
        { from: 'Namba Parks', to: 'Grand Front Osaka', method: 2, time: '20분' },
        { from: 'Grand Front Osaka', to: 'Osaka Castle', method: 2, time: '25분' },
      ],
    },
    {
      day: 3,
      locations: [
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)', startTime: '09:00', endTime: '09:30' },
        { lat: 35.039389, lng: 135.729243, name: 'Arashiyama Bamboo Grove', description: '아라시야마 대나무 숲', startTime: '10:00', endTime: '11:30' },
        { lat: 35.003707, lng: 135.775367, name: 'Kiyomizu-dera', description: '기요미즈데라', startTime: '12:00', endTime: '13:00' },
        { lat: 35.005377, lng: 135.780928, name: 'Sanjusangendo', description: '산쥬산겐도', startTime: '14:00', endTime: '15:00' },
        { lat: 35.030555, lng: 135.756892, name: 'Gion', description: '기온', startTime: '16:00', endTime: '17:00' },
        { lat: 34.693738, lng: 135.502165, name: 'Osaka Castle', description: '숙소 (오사카 성)', startTime: '18:00', endTime: '21:00' },
      ],
      routes: [
        { from: 'Osaka Castle', to: 'Arashiyama Bamboo Grove', method: 2, time: '50분' },
        { from: 'Arashiyama Bamboo Grove', to: 'Kiyomizu-dera', method: 2, time: '35분' },
        { from: 'Kiyomizu-dera', to: 'Sanjusangendo', method: 1, time: '10분' },
        { from: 'Sanjusangendo', to: 'Gion', method: 3, time: '15분' },
        { from: 'Gion', to: 'Osaka Castle', method: 2, time: '50분' },
      ],
    },
  ];
  
  export default dayLocations;
  