'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';
import MapComponent from '@/components/plan/map';
import Timeline from '@/components/plan/timeLine'; // 새로운 타임라인 컴포넌트
import TravelModal from '@/components/modal/travelModal'; // 새로운 모달 컴포넌트
import { fetchData } from '@/services/dockerTest'; // fetchData 함수 가져오기

const Planning = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<null | { lat: number, lng: number, name: string, description: string }>(null);
  const router = useRouter();

  const {
    departure,
    arrival,
    startDate,
    endDate,
    numberOfPeople,
    budget,
  } = useTravelStore();

  useEffect(() => {
    if (!departure || !arrival || !startDate || !endDate || !numberOfPeople || !budget) {
      router.push('/'); // 데이터가 없으면 홈으로 리다이렉트
    }
  }, [departure, arrival, startDate, endDate, numberOfPeople, budget, router]);

  const handleCheck = async () => {
    try {
      const data = await fetchData();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Error fetching data');
      setResponse(null);
    }
  };

  const dayLocations = [
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
  

  return (
    <main className="flex min-h-screen bg-gray-100">
      {/* 사이드 */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-500 text-white flex flex-col p-4 shadow-lg">
        <nav className="flex flex-col space-y-4">
          <button onClick={handleCheck} className="bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-600 font-bold py-2 px-4 rounded-md transition duration-300">
            백단 통신체크
          </button>
          <button onClick={() => router.push('/page2')} className="flex items-center p-2 hover:bg-blue-600 rounded-md transition duration-300">
            Page 2
          </button>
          <button onClick={() => router.push('/page3')} className="flex items-center p-2 hover:bg-blue-600 rounded-md transition duration-300">
            Page 3
          </button>
        </nav>
      </aside>

      {/* 메인 */}
      <section className="w-full bg-gray-50 p-6 flex flex-col text-gray-800">
        <div className="w-full max-w-6xl mb-4">
          <h2 className="text-4xl font-bold mb-6">여행지 : {arrival}</h2>
          <p><strong>여행일:</strong> {startDate} ~ {endDate}</p>
          <p><strong>인원수:</strong> {numberOfPeople}</p>
          <p><strong>예산:</strong> {budget} 원</p>

          {response && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <p>Response:</p>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              <p>{error}</p>
            </div>
          )}
        </div>
        <div className="flex-grow flex">
          {/* 타임라인 */}
          <section className="w-1/3 pr-6 text-gray-800">
            <Timeline dayLocations={dayLocations} />
          </section>
          {/* 지도 */}
          <section className="w-2/3 flex-grow">
            <div className="w-full h-full bg-white border rounded-md shadow-md p-6">
              <MapComponent dayLocations={dayLocations} onMarkerClick={setSelectedLocation} />
            </div>
          </section>
        </div>
      </section>
      
      {selectedLocation && (
        <TravelModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </main>
  );
};

export default Planning;
