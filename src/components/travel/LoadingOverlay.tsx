'use client';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
    isVisible, 
    message = "여행 데이터를 불러오는 중..." 
}) => {
    if (!isVisible) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl">
                <div className="flex flex-col items-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce mr-1"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce mr-1 delay-150"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-1">{message}</p>
                    <p className="text-sm text-gray-500">잠시만 기다려 주세요</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
