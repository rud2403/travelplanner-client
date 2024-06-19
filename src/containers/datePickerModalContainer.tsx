import React, { useState } from 'react';
import DatePicker from '@/components/modal/datePicker';

interface DatePickerModalContainerProps {
  onClose: () => void;
  onNext: () => void;
}

const DatePickerModalContainer: React.FC<DatePickerModalContainerProps> = ({ onClose, onNext }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const handleDateChange = (range: [Date, Date]) => {
    setDateRange(range);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <DatePicker
      currentDate={currentDate}
      dateRange={dateRange}
      onDateChange={handleDateChange}
      onMonthChange={handleMonthChange}
      onClose={onClose}
      onNext={onNext}
    />
  );
};

export default DatePickerModalContainer;
