'use client';

interface ErrorDisplayProps {
    message: string;
    onHomeClick: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onHomeClick }) => {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</p>
                <p className="text-red-600 mb-6">{message}</p>
                <button 
                    onClick={onHomeClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow hover:shadow-lg transition-all duration-300"
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default ErrorDisplay;
