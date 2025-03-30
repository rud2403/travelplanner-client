'use client';

interface EditDescriptionModalProps {
    isOpen: boolean;
    description: string;
    onClose: () => void;
    onSave: () => void;
    onChange: (value: string) => void;
}

const EditDescriptionModal: React.FC<EditDescriptionModalProps> = ({
    isOpen,
    description,
    onClose,
    onSave,
    onChange
}) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">여행 설명 수정</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        여행 설명
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="여행에 대한 설명을 입력해주세요"
                        className="w-full h-32 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        취소
                    </button>
                    <button
                        onClick={onSave}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDescriptionModal;
