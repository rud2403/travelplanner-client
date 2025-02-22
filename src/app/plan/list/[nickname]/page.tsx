'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getTravelPlanByIdAPI } from '@/services/travelPlan';
import { travelPlanData } from '@/data/travelPlanData';
import { useTravelStore } from '@/store/useTravelStore';

interface Trip {
    id: number;
    userId: number;
    destination: string;
    description: string;
    country: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
}

const DEFAULT_IMAGE = "/images/travel_default.png";
const JP_IMAGE = "/images/travel_japan.png";
const US_IMAGE = "/images/travel_usa.png";
const VN_IMAGE = "/images/travel_vietnam.png";

const UserPlanPage: React.FC = () => {
    const { nickname } = useParams();
    const router = useRouter();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        setDestination,
        setStartDate,
        setEndDate,
    } = useTravelStore();

    useEffect(() => {
        if (nickname) {
            console.log('Fetching trips for:', nickname);
            axios.get(`/api/user/trips?nickname=${nickname}`)
                .then(response => {
                    if (response.data.status === 200) {
                        setTrips(response.data.data);
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

    const handleTripSelect = async (tripId: number) => {
        try {
            setIsLoading(true);
            console.log(`Fetching travel details for Trip ID: ${tripId}`);

            const response = await getTravelPlanByIdAPI(tripId);

            if (response.status === 200) {
                const tripData = response.data;
                console.log('API Response:', tripData);

                setDestination(tripData.destination);
                setStartDate(tripData.startDate);
                setEndDate(tripData.endDate);

                travelPlanData.length = 0;
                travelPlanData.push(...tripData.dates);

                router.push('/plan');
            } else {
                console.error("Failed to fetch trip details:", response.message);
            }
        } catch (error) {
            console.error('Failed to fetch trip details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <p className="text-lg font-semibold text-gray-600">여행 데이터를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    {nickname}의 여행 일정
                </h1>

                {trips.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">여행 일정이 없습니다.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {trips.map(trip => {
                            let imageUrl = DEFAULT_IMAGE;
                            if (trip.country === 'JP') {
                                imageUrl = JP_IMAGE;
                            } else if (trip.country === 'US') {
                                imageUrl = US_IMAGE;
                            } else if (trip.country === 'VN') {
                                imageUrl = VN_IMAGE;
                            }

                            return (
                                <div 
                                    key={trip.id} 
                                    className="relative bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 cursor-pointer transform transition duration-300 hover:scale-105"
                                    onClick={() => handleTripSelect(trip.id)}
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt={trip.destination} 
                                        className="w-full h-56 object-cover"
                                        onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                                    />
                                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                                        {trip.country === 'JP' ? '일본' : trip.country === 'US' ? '미국' : trip.country === 'VN' ? '베트남' : '기타'}
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-800">{trip.destination}</h2>
                                        <p className="text-gray-500 mt-2 text-sm">{trip.description}</p>
                                        <p className="text-gray-600 mt-2 text-sm">
                                            <span className="font-medium">출발:</span> {trip.startDate}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">도착:</span> {trip.endDate}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 로딩 모달 */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold text-gray-700">여행 데이터를 불러오는 중...</p>
                        <div className="mt-4 flex justify-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPlanPage;
