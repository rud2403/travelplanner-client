'use client';

import { Trip } from '@/types/trip';

interface TripCardProps {
    trip: Trip;
    onSelect: (tripId: number) => void;
    onEdit: (tripId: number) => void;
    onDelete: (tripId: number) => void;
    openMenuId: number | null;
    toggleMenu: (tripId: number) => void;
}

const DEFAULT_IMAGE = "/images/travel_default.png";
const JP_IMAGE = "/images/travel_japan.png";
const US_IMAGE = "/images/travel_usa.png";
const VN_IMAGE = "/images/travel_vietnam.png";

const TripCard: React.FC<TripCardProps> = ({
    trip,
    onSelect,
    onEdit,
    onDelete,
    openMenuId,
    toggleMenu
}) => {
    let imageUrl = DEFAULT_IMAGE;
    if (trip.country === 'JP') imageUrl = JP_IMAGE;
    else if (trip.country === 'US') imageUrl = US_IMAGE;
    else if (trip.country === 'VN') imageUrl = VN_IMAGE;

    return (
        <div
            key={trip.id}
            className="group relative bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:translate-y-[-8px]"
            onClick={() => onSelect(trip.id)}
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {e.currentTarget.src = DEFAULT_IMAGE}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* 국가 태그 */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-800 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wide">
                {trip.country === 'JP' ? '일본' : trip.country === 'US' ? '미국' : trip.country === 'VN' ? '베트남' : '기타'}
            </div>

            {/* 점 3개 버튼 */}
            <div className="absolute top-4 right-4 z-30">
                <div className="relative">
                    <button
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 hover:bg-white shadow-sm transition-all duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(trip.id);
                        }}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>

                    {openMenuId === trip.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                            <button
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(trip.id);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                설명 수정
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(trip.id);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 본문 */}
            <div className="p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                    {trip.destination}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{trip.description || '여행 설명이 없습니다.'}</p>
                
                <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-gray-600">
                            <span className="font-medium">출발:</span> {trip.startDate}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span className="text-xs text-gray-600">
                            <span className="font-medium">도착:</span> {trip.endDate}
                        </span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button className="text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors duration-200 flex items-center">
                        일정 보기
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripCard;
