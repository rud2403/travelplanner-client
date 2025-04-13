'use client';

import React from 'react';

interface SaveButtonProps {
  onSave?: () => void;
  onExportExcel: () => void;
  onEdit?: () => void;
  isEditMode?: boolean;
  timelineWidth: number;
  showSaveButton?: boolean;
  canSaveChanges?: boolean;
}

/**
 * 여행 일정 저장 및 내보내기 버튼 컴포넌트
 */
const SaveButton: React.FC<SaveButtonProps> = ({ onSave, onExportExcel, onEdit, isEditMode = false, timelineWidth, showSaveButton = true, canSaveChanges = false }) => {
  return (
    <div className="w-full mx-auto mb-4 flex">
      <div className="flex-1"></div> {/* 좌측 공간 - 타임라인 너비와 동일 */}
      <div className="flex-[2] flex justify-end gap-3 pr-1"> {/* 오른쪽 공간 - 맵 너비와 동일 */}
        {!isEditMode && (
          <button
            onClick={onExportExcel}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            엑셀로 내보내기
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isEditMode && !canSaveChanges}
            className={`flex items-center px-4 py-2 ${isEditMode ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${isEditMode && !canSaveChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {isEditMode ? (canSaveChanges ? '변경사항 저장' : '수정할 내용이 없습니다') : '여행일정 수정'}
          </button>
        )}

        {showSaveButton && onSave && (
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            여행 일정 저장
          </button>
        )}
      </div>
    </div>
  );
};

export default SaveButton;
