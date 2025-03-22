'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getTravelPlanByIdAPI, updateTripDescriptionAPI } from '@/services/travelPlan';
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
    const [openMenuId, setOpenMenuId] = useState<number | null>(null); // 메뉴 토글용
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTripId, setEditingTripId] = useState<number | null>(null);
    const [newDescription, setNewDescription] = useState<string>('');

    const {
        setId,
        setDestination,
        setDescription,
        setStartDate,
        setEndDate,
    } = useTravelStore();

    useEffect(() => {
        if (nickname) {
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
            const response = await getTravelPlanByIdAPI(tripId);

            if (response.status === 200) {
                const tripData = response.data;

                setId(tripData.id);
                setDestination(tripData.destination);
                setDescription(tripData.description);
                setStartDate(tripData.startDate);
                setEndDate(tripData.endDate);

                travelPlanData.length = 0;
                travelPlanData.push(...tripData.dates);

                router.push('/plan');
            } else {
                console.error("여행 정보 조회 실패:", response.message);
            }
        } catch (error) {
            console.error('여행 상세 조회 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMenu = (tripId: number) => {
        setOpenMenuId(prev => (prev === tripId ? null : tripId));
    };

    const handleDeleteTrip = (tripId: number) => {
        console.log("삭제 요청:", tripId);
        // TODO: axios.delete(`/api/travelplan/${tripId}`)
        setOpenMenuId(null);
    };

    const handleEditTrip = (tripId: number) => {
        const selectedTrip = trips.find(t => t.id === tripId);
        if (selectedTrip) {
            setEditingTripId(tripId);
            setNewDescription(selectedTrip.description || '');
            setIsEditModalOpen(true);
            setOpenMenuId(null); // 메뉴 닫기
        }
    };

    const handleSaveDescription = async () => {
        if (editingTripId !== null) {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const updateData = { description: newDescription };

                await updateTripDescriptionAPI(editingTripId, updateData, jwtToken);

                // 상태 업데이트
                setTrips(prev =>
                    prev.map(t =>
                        t.id === editingTripId ? { ...t, description: newDescription } : t
                    )
                );
                setIsEditModalOpen(false);
                setEditingTripId(null);

                alert('여행 설명이 업데이트되었습니다.');
            } catch (error) {
                console.error('설명 업데이트 실패:', error);
            }
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
                            if (trip.country === 'JP') imageUrl = JP_IMAGE;
                            else if (trip.country === 'US') imageUrl = US_IMAGE;
                            else if (trip.country === 'VN') imageUrl = VN_IMAGE;

                            return (
                                <div
                                    key={trip.id}
                                    className="relative group bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 cursor-pointer transform transition duration-300 hover:scale-105"
                                    onClick={() => handleTripSelect(trip.id)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={trip.destination}
                                        className="w-full h-56 object-cover"
                                        onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                                    />

                                    {/* 국가 태그 */}
                                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                                        {trip.country === 'JP' ? '일본' : trip.country === 'US' ? '미국' : trip.country === 'VN' ? '베트남' : '기타'}
                                    </div>

                                    {/* 점 3개 버튼 */}
                                    <div className="absolute top-2 right-2 z-30">
                                        <div className="relative">
                                            <button
                                                className="flex items-center justify-center w-8 h-10 rounded-full bg-white bg-opacity-70 text-gray-500 hover:text-gray-800 hover:bg-opacity-100 shadow transition-all duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(trip.id);
                                                }}
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                                                </svg>
                                            </button>

                                            {openMenuId === trip.id && (
                                                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-50">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditTrip(trip.id);
                                                        }}
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 상위 카드 클릭 방지
                                                            handleDeleteTrip(trip.id);
                                                        }}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 본문 */}
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

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">여행 설명 수정</h2>
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full h-32 border rounded-md p-2 text-sm text-gray-800"
                        />
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveDescription}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserPlanPage;
