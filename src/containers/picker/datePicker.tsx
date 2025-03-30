import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PickerModal from '@/components/modal/pickerModal';

interface DatePickerModalProps {
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  dateRange: [string, string] | null;
  setDateRange: (range: [string, string] | null) => void;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DatePickerModal: React.FC<DatePickerModalProps> = ({ onClose, onNext, onPrevious, dateRange, setDateRange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (value: Date[]) => {
    if (value.length === 2) {
      const [start, end] = value;
      if (start && end) {
        setDateRange([formatDate(start), formatDate(end)]);
      }
    } else if (value.length === 1) {
      // 하나만 선택한 경우 - 현재 선택한 날짜를 표시하기 위해 추가
      const selectedDate = formatDate(value[0]);
      setDateRange([selectedDate, selectedDate]);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // 커스텀 클래스 대신 react-calendar 기본 클래스 사용
  const tileClassName = null;

  const customStyles = `
    .react-calendar {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 1rem;
      border-radius: 16px !important;
      border: 1px solid #e5e7eb !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
      overflow: hidden;
      width: 800px !important;
    }
    
    .react-calendar__tile {
      border-radius: 0 !important;
      height: 48px !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      font-weight: 500;
      color: #000 !important;
      position: relative !important;
    }

    .react-calendar__tile:enabled:hover {
      background-color: rgba(219, 234, 254, 0.5) !important;
      z-index: 2 !important;
    }
    
    /* React Calendar 기본 클래스 수정 */
    .react-calendar__tile--active {
      background-color: #dbeafe !important;
      color: #1e40af !important;
    }
    
    /* 실시간 선택된 범위 하이라이트 - 시작과 끝 사이 */
    .react-calendar__tile--rangeStart,
    .react-calendar__tile--rangeEnd,
    .react-calendar__tile--range {
      background-color: #dbeafe !important;
      color: #1e40af !important;
    }
    
    /* 범위 시작과 끝이 같은 경우 */
    .react-calendar__tile--rangeBothEnds {
      background-color: #dbeafe !important;
      color: #1e40af !important;
      font-weight: bold;
      box-shadow: inset 0 0 0 2px #3b82f6;
    }
    
    /* 범위 시작 날짜 */
    .react-calendar__tile--rangeStart:not(.react-calendar__tile--rangeBothEnds) {
      border-left: 2px solid #3b82f6 !important;
      border-top: 1px solid #bfdbfe !important;
      border-bottom: 1px solid #bfdbfe !important;
    }
    
    /* 범위 끝 날짜 */
    .react-calendar__tile--rangeEnd:not(.react-calendar__tile--rangeBothEnds) {
      border-right: 2px solid #3b82f6 !important;
      border-top: 1px solid #bfdbfe !important;
      border-bottom: 1px solid #bfdbfe !important;
    }
    
    /* 오늘 날짜 스타일 */
    .react-calendar__tile--now {
      background-color: #fef3c7 !important;
      color: #92400e !important;
      font-weight: bold;
    }
    
    .react-calendar__tile--now:hover {
      background-color: #fde68a !important;
    }
    
    /* 지난 날짜 스타일 */
    .react-calendar__tile:disabled {
      background-color: #f3f4f6 !important;
      color: #9ca3af !important;
      cursor: not-allowed;
      border-radius: 0 !important;
    }
    
    /* 일요일 색상 - 모든 일요일 */
    .react-calendar__month-view__days__day--weekend:nth-child(7n+1) {
      color: #ef4444 !important;
    }
    
    /* 토요일 색상 - 모든 토요일 */
    .react-calendar__month-view__days__day--weekend:nth-child(7n) {
      color: #3b82f6 !important;
    }
    
    /* 비활성화된 주말 날짜(다른 달이나 지난 날짜) */
    .react-calendar__tile:disabled.react-calendar__month-view__days__day--weekend {
      color: #9ca3af !important;
      background-color: #f3f4f6 !important;
    }
    
    /* 이웃한 달 날짜 색상 */
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #a1a1aa !important;
      opacity: 0.7 !important;
    }
    
    /* 요일 헤더 스타일 */
    .react-calendar__month-view__weekdays {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }
    
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.75rem;
    }
    
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
      color: #000 !important;
    }
    
    /* 일요일, 토요일 텍스트 색상 */
    .react-calendar__month-view__weekdays__weekday:nth-child(1) abbr { color: #ef4444 !important; }
    .react-calendar__month-view__weekdays__weekday:nth-child(7) abbr { color: #3b82f6 !important; }
    
    .react-calendar__navigation { display: none !important; }
    
    /* 테이블 구조 개선 */
    table.react-calendar__month-view__days {
      border-collapse: collapse;
    }
    
    .react-calendar__month-view__days__day {
      border: none !important;
      outline: none !important;
      position: relative !important;
    }
  `;

  return (
    <PickerModal title="날짜 선택" onClose={onClose} onNext={onNext} onPrevious={onPrevious}>
      <style>{customStyles}</style>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-4 mb-2">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200" 
            onClick={() => handleMonthChange('prev')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <div className="flex justify-between w-full px-8">
            <span className="text-xl font-semibold text-gray-800 w-1/2 text-center">{formatMonthYear(currentDate)}</span>
            <span className="text-xl font-semibold text-gray-800 w-1/2 text-center">{formatMonthYear(nextMonthDate)}</span>
          </div>
          
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200" 
            onClick={() => handleMonthChange('next')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        {/* 선택된 날짜 표시 */}
        {dateRange && (
          <div className="flex items-center justify-center w-full mb-6 mt-2 p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <p className="text-sm font-medium text-gray-800">
                {new Date(dateRange[0]).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} ~ {new Date(dateRange[1]).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        )}
        
      <Calendar
          onChange={(value) => handleDateChange(value as Date[])}
          minDate={new Date()}
          value={dateRange ? [new Date(dateRange[0]), new Date(dateRange[1])] : null}
          calendarType="gregory"
          className="mx-auto"
          showDoubleView={true}
          selectRange={true}
          activeStartDate={currentDate}
          returnValue="range"
          showFixedNumberOfWeeks={true}
          showNeighboringMonth={true}
          formatDay={(locale, date) => `${date.getDate()}일`}
        />
      </div>
    </PickerModal>
  );
};

export default DatePickerModal;
