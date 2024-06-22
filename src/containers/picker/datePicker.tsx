import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PickerModal from '@/components/modal/pickerModal';
import styles from './datePicker.module.css';

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

  const isWithinRange = (date: Date, start: string, end: string) => {
    const d = new Date(date).setHours(0, 0, 0, 0);
    const s = new Date(start).setHours(0, 0, 0, 0);
    const e = new Date(end).setHours(23, 59, 59, 999);
    return d >= s && d <= e;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const classes = [];
      if (dateRange) {
        if (isWithinRange(date, dateRange[0], dateRange[1])) {
          classes.push(styles.highlight);
        }
        if (isSameDay(date, new Date(dateRange[0]))) {
          classes.push(styles.startDate);
        }
        if (isSameDay(date, new Date(dateRange[1]))) {
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
    <PickerModal title="날짜 선택" onClose={onClose} onNext={onNext} onPrevious={onPrevious}>
      <style>{customStyles}</style>
      <div className="flex items-center justify-center gap-4">
        <span className="cursor-pointer text-2xl text-black" onClick={() => handleMonthChange('prev')}>
          &lt;
        </span>
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full mb-4">
            <span className="text-2xl font-semibold text-black w-1/2 text-center">{formatMonthYear(currentDate)}</span>
            <span className="text-2xl font-semibold text-black w-1/2 text-center">{formatMonthYear(nextMonthDate)}</span>
          </div>
          <Calendar
            onChange={(value) => handleDateChange(value as Date[])}
            minDate={new Date()}
            value={dateRange ? [new Date(dateRange[0]), new Date(dateRange[1])] : null}
            calendarType="gregory"
            className="rounded-md border-gray-300 shadow-sm mx-auto"
            tileClassName={tileClassName}
            showDoubleView={true}
            selectRange={true}
            activeStartDate={currentDate}
            returnValue="range"
          />
        </div>
        <span className="cursor-pointer text-2xl text-black" onClick={() => handleMonthChange('next')}>
          &gt;
        </span>
      </div>
    </PickerModal>
  );
};

export default DatePickerModal;
