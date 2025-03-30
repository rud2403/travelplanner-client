'use client';

interface EmptyTripsDisplayProps {
    onNewTrip: () => void;
}

const EmptyTripsDisplay: React.FC<EmptyTripsDisplayProps> = ({ onNewTrip }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16l0 40M5 7l7-7 7 7" />
            </svg>
            <p className="text-center text-gray-500 text-lg font-medium mb-2">여행 일정이 없습니다.</p>
            <p className="text-center text-gray-400 text-sm mb-6">새로운 여행을 계획해보세요!</p>
            <button 
                onClick={onNewTrip} 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
            >
                새 여행 계획하기
            </button>
        </div>
    );
};

export default EmptyTripsDisplay;
