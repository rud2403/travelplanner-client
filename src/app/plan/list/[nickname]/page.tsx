'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTravelPlanByIdAPI, updateTripDescriptionAPI, deleteTripAPI, getPagedTripsByNickname } from '@/services/travelPlan';
import { travelPlanData } from '@/data/travelPlanData';
import { useTravelStore } from '@/store/useTravelStore';
import { Trip } from '@/types/trip';
import { TripPageData } from '@/types/tripPage';
import LoadingOverlay from '@/components/travel/LoadingOverlay';
import ErrorDisplay from '@/components/travel/ErrorDisplay';
import EmptyTripsDisplay from '@/components/travel/EmptyTripsDisplay';
import TripCard from '@/components/travel/TripCard';
import Pagination from '@/components/travel/Pagination';
import EditDescriptionModal from '@/components/travel/EditDescriptionModal';

const UserPlanPage = () => {
    const params = useParams();
    const nicknameParam = Array.isArray(params.nickname) 
        ? params.nickname[0] 
        : params.nickname;
    
    console.log('URL 매개변수 목록:', params);
    console.log('nickname 값:', nicknameParam);
    
    const router = useRouter();

    const [tripPage, setTripPage] = useState<TripPageData | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(8);
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

    // 직접 API 응답 확인
    useEffect(() => {
        const checkAPI = async () => {
            if (!nicknameParam) return;
            try {
                // 직접 fetch 요청 보내기
                const origResponse = await fetch(`/api/user/trips?nickname=${nicknameParam}`);
                const jsonData = await origResponse.json();
                console.log('원래 API 호출 응답:', jsonData);
                
                if (jsonData.data && Array.isArray(jsonData.data)) {
                    console.log('가져온 여행 데이터 개수:', jsonData.data.length);
                    
                    // 응답 제대로 처리
                    if (jsonData.status === 200) {
                        setTripPage({
                            content: jsonData.data,
                            pageNumber: 0,
                            pageSize: jsonData.data.length,
                            totalPages: 1,
                            totalElements: jsonData.data.length,
                            first: true,
                            last: true
                        });
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('원래 API 호출 오류:', err);
            }
        };
        
        checkAPI();
    }, [nicknameParam]);

    const fetchTrips = async (page: number = 0) => {
        if (!nicknameParam) return;
        
        setLoading(true);
        try {
            const response = await getPagedTripsByNickname(String(nicknameParam), page, pageSize);
            
            console.log('fetchTrips: API 응답 전체:', response);
            
            // response 구조 분석
            if (response.status === 200) {
                // 응답이 data 필드에 다시 데이터를 포함하는 경우 (일반적 백엔드 응답 패턴)
                if (response.data && typeof response.data === 'object') {
                    console.log('Page 상태 업데이트. 데이터:', response.data);
                    
                    // response.data.data가 TripPageData 형태인 경우
                    if (response.data.content || (response.data.data && response.data.data.content)) {
                        const pageData = response.data.content ? response.data : response.data.data;
                        setTripPage(pageData);
                    }
                    // response.data.data가 Trip[] 배열인 경우 (페이징되지 않은 데이터)
                    else if (Array.isArray(response.data.data)) {
                        console.log('페이징되지 않은 데이터 변환:', response.data.data);
                        // 배열을 페이징 형태로 변환
                        setTripPage({
                            content: response.data.data,
                            pageNumber: 0,
                            pageSize: response.data.data.length,
                            totalPages: 1,
                            totalElements: response.data.data.length,
                            first: true,
                            last: true
                        });
                    } else {
                        console.error('알 수 없는 응답 데이터 형식');
                        setError('여행 데이터 구조가 잘못되었습니다.');
                    }
                } else {
                    setError('여행 데이터 구조가 잘못되었습니다.');
                }
            } else {
                setError(response.message || "여행 데이터를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error('여행 데이터 조회 실패:', error);
            setError("여행 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('URL 파라미터 nicknameParam:', nicknameParam);
        if (nicknameParam) {
            fetchTrips(currentPage);
        } else {
            console.error('nicknameParam이 없습니다!');
        }
    }, [nicknameParam, currentPage, pageSize, fetchTrips]);

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

    const handleDeleteTrip = async (tripId: number) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            await deleteTripAPI(tripId, jwtToken);

            // 여행 삭제 후 해당 페이지를 다시 불러옴
            fetchTrips(currentPage);
            alert('여행이 삭제되었습니다.');
        } catch (error) {
            console.error('여행 삭제 실패:', error);
            alert('여행 삭제 중 오류가 발생했습니다.');
        } finally {
            setOpenMenuId(null);
        }
    };

    const handleEditTrip = (tripId: number) => {
        if (!tripPage || !tripPage.content) return;
        
        const selectedTrip = tripPage.content.find(t => t.id === tripId);
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

                // 설명 업데이트 후 페이지 다시 불러옴
                fetchTrips(currentPage);
                setIsEditModalOpen(false);
                setEditingTripId(null);

                alert('여행 설명이 업데이트되었습니다.');
            } catch (error) {
                console.error('설명 업데이트 실패:', error);
            }
        }
    };

    // 페이지 이동 처리
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // 로딩 중이면 로딩 표시
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex justify-center mb-6">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce mr-1"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce mr-1 delay-150"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-1">여행 데이터를 불러오는 중...</p>
                    <p className="text-sm text-gray-500">잠시만 기다려 주세요</p>
                </div>
            </div>
        );
    }

    // 에러가 있으면 에러 표시
    if (error) {
        return <ErrorDisplay message={error} onHomeClick={() => router.push('/')} />;
    }

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        {nicknameParam}의 여행 일정
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        지금까지 계획한 모든 여행 일정을 한눈에 확인하고 관리하세요. 클릭하여 상세 일정을 확인할 수 있습니다.
                    </p>
                </div>

                {/* 데이터가 없을 때 표시 */}
                {(!tripPage || !tripPage.content || tripPage.content.length === 0) && (
                    <EmptyTripsDisplay onNewTrip={() => router.push('/')} />
                )}

                {/* 데이터가 있을 때 표시 */}
                {tripPage && tripPage.content && tripPage.content.length > 0 && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {tripPage.content.map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onSelect={handleTripSelect}
                                    onEdit={handleEditTrip}
                                    onDelete={handleDeleteTrip}
                                    openMenuId={openMenuId}
                                    toggleMenu={toggleMenu}
                                />
                            ))}
                        </div>
                    
                        {/* 페이지네이션 */}
                        {tripPage.totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={tripPage.totalPages}
                                isFirstPage={tripPage.first}
                                isLastPage={tripPage.last}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* 로딩 오버레이 */}
            <LoadingOverlay isVisible={isLoading} />

            {/* 설명 수정 모달 */}
            <EditDescriptionModal
                isOpen={isEditModalOpen}
                description={newDescription}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveDescription}
                onChange={setNewDescription}
            />
        </div>
    );
};

export default UserPlanPage;
