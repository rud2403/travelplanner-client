'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    isFirstPage,
    isLastPage,
    onPageChange
}) => {
    if (totalPages <= 1) return null;
    
    return (
        <div className="flex justify-center mt-12">
            <nav className="inline-flex rounded-md shadow">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isFirstPage}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                        isFirstPage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300`}
                >
                    이전
                </button>
                
                {/* 페이지 번호 버튼들 */}
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`px-4 py-2 text-sm font-medium ${
                            i === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        } border-t border-b border-gray-300`}
                    >
                        {i + 1}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLastPage}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                        isLastPage
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300`}
                >
                    다음
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
