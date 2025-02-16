'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

// 여행 정보를 위한 타입 정의
interface Trip {
    id: number;
    userId: number;
    destination: string;
    startDate: string;
    endDate: string;
    imageUrl?: string; // ✨ 여행지 대표 이미지 (선택적)
}

// 기본 이미지 경로 (Next.js `public/` 폴더 사용)
const DEFAULT_IMAGE = "/images/travel_default.png";

const UserPlanPage: React.FC = () => {
    const { nickname } = useParams(); // URL에서 nickname 가져오기
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (nickname) {
            console.log('nickname: ', nickname);
            axios.get(`/api/user/trips?nickname=${nickname}`) // API URL
                .then(response => {
                    if (response.data.status === 200) {
                        setTrips(response.data.data); // 여행 데이터 저장
                    } else {
                        setError(response.data.message || "여행 데이터를 불러올 수 없습니다.");
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching trip data:', error);
                    setError("여행 데이터를 불러오는 중 오류가 발생했습니다.");
                    setLoading(false);
                });
        }
    }, [nickname]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <p className="text-lg text-gray-500">Loading trip data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    {nickname}의 여행 일정
                </h1>
                
                {trips.length === 0 ? (
                    <p className="text-center text-gray-500">여행 일정이 없습니다.</p>
                ) : (
                    // 여행지 카드 한 줄에 2개씩 정렬 (반응형)
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {trips.map(trip => {
                            // API에서 받은 이미지가 없으면 기본 이미지 사용
                            const imageUrl = trip.imageUrl || DEFAULT_IMAGE;

                            return (
                                <div 
                                    key={trip.id} 
                                    className="bg-gray-100 shadow-lg rounded-lg overflow-hidden border border-gray-300 min-h-[320px]"
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt={trip.destination} 
                                        className="w-full h-60 object-cover"
                                        onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} // 이미지 로딩 실패 시 기본 이미지로 대체
                                    />
                                    <div className="p-6 text-center">
                                        <h2 className="text-lg font-semibold text-gray-700">{trip.destination}</h2>
                                        <p className="text-gray-500 mt-2">
                                            <span className="font-medium">시작:</span> {trip.startDate}
                                        </p>
                                        <p className="text-gray-500">
                                            <span className="font-medium">종료:</span> {trip.endDate}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPlanPage;
