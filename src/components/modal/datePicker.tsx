import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './datePicker.module.css';
import CommonButton from '@/components/button/commonButton';

interface DatePickerProps {
  currentDate: Date;
  dateRange: [Date, Date] | null;
  onDateChange: (range: [Date, Date]) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onClose: () => void;
  onNext: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  currentDate,
  dateRange,
  onDateChange,
  onMonthChange,
  onClose,
  onNext,
}) => {
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

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const classes = [];
      if (dateRange) {
        if (date >= dateRange[0] && date <= dateRange[1]) {
          classes.push(styles.highlight);
        }
        if (isSameDay(date, dateRange[0])) {
          classes.push(styles.startDate);
        }
        if (isSameDay(date, dateRange[1])) {
          classes.push(styles.endDate);
        }
      }
      if (date.getDay() === 0) {
        classes.push(styles.sunday);
      } else if (date.getDay() === 6) {
        classes.push(styles.saturday);
      } else {
        classes.push(styles.weekday);
      }
      return classes.join(' ');
    }
    return null;
  };

  const customStyles = `
    .react-calendar__month-view__weekdays__weekday:nth-child(1) abbr { color: red !important; }
    .react-calendar__month-view__weekdays__weekday:nth-child(7) abbr { color: blue !important; }
    .react-calendar__month-view__weekdays__weekday:nth-child(2),
    .react-calendar__month-view__weekdays__weekday:nth-child(3),
    .react-calendar__month-view__weekdays__weekday:nth-child(4),
    .react-calendar__month-view__weekdays__weekday:nth-child(5),
    .react-calendar__month-view__weekdays__weekday:nth-child(6) abbr { color: black !important; }
    .react-calendar__navigation { display: none !important; }
  `;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <style>{customStyles}</style>
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">날짜 선택</h2>
        <div className="flex items-center justify-center gap-4">
          <span
            className="cursor-pointer text-2xl text-black"
            onClick={() => onMonthChange('prev')}
          >
            &lt;
          </span>
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-4">
              <span className="text-2xl font-semibold text-black w-1/2 text-center">{formatMonthYear(currentDate)}</span>
              <span className="text-2xl font-semibold text-black w-1/2 text-center">{formatMonthYear(nextMonthDate)}</span>
            </div>
            <Calendar
              onChange={(value) => {
                if (Array.isArray(value)) {
                  onDateChange(value as [Date, Date]);
                }
              }}
              minDate={new Date()}
              value={dateRange}
              calendarType="gregory"
              className="rounded-md border-gray-300 shadow-sm mx-auto"
              tileClassName={tileClassName}
              showDoubleView={true}
              selectRange={true}
              activeStartDate={currentDate}
              returnValue="range"
            />
          </div>
          <span
            className="cursor-pointer text-2xl text-black"
            onClick={() => onMonthChange('next')}
          >
            &gt;
          </span>
        </div>
        <div className="mt-8 flex justify-center gap-6">
          <CommonButton label="취소" onClick={onClose} color="gray" />
          <CommonButton label="다음" onClick={onNext} color="blue" />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
