import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { getProductBookedRanges } from '../services/mockData';

interface AvailabilityCalendarProps {
  productId: string;
  onRangeSelect: (start: string, end: string) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ productId, onRangeSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedRanges, setBookedRanges] = useState<{ start: Date; end: Date }[]>([]);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset selection when product changes
    setSelectionStart(null);
    setSelectionEnd(null);
    setError(null);
    // Fetch bookings
    const ranges = getProductBookedRanges(productId);
    setBookedRanges(ranges);
  }, [productId]);

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday. We want Monday start (0=Mon, 6=Sun)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isDateDisabled = (date: Date) => {
    // 1. Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // 2. Disable booked dates
    return bookedRanges.some(range => {
      // Normalize times for comparison
      const rStart = new Date(range.start);
      rStart.setHours(0,0,0,0);
      const rEnd = new Date(range.end);
      rEnd.setHours(23,59,59,999);
      return date >= rStart && date <= rEnd;
    });
  };

  const isRangeValid = (start: Date, end: Date) => {
    // Check if any booked date falls inside the selected range
    return !bookedRanges.some(range => {
      const rStart = new Date(range.start);
      rStart.setHours(0,0,0,0);
      const rEnd = new Date(range.end);
      rEnd.setHours(23,59,59,999);
      
      // If the booking starts after our selection starts AND before our selection ends
      // OR if the booking ends after our selection starts AND before our selection ends
      // OR if the booking completely covers our selection
      return (
        (rStart >= start && rStart <= end) ||
        (rEnd >= start && rEnd <= end) ||
        (rStart <= start && rEnd >= end)
      );
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    if (isDateDisabled(clickedDate)) return;

    setError(null);

    // Case 1: Start new selection
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(clickedDate);
      setSelectionEnd(null);
      // Callback with empty/reset
      onRangeSelect('', ''); 
    } 
    // Case 2: Complete selection
    else if (selectionStart && !selectionEnd) {
      if (clickedDate < selectionStart) {
        // User clicked earlier date, reset start
        setSelectionStart(clickedDate);
      } else {
        // Verify range
        if (isRangeValid(selectionStart, clickedDate)) {
          setSelectionEnd(clickedDate);
          // Format for parent: YYYY-MM-DD
          const fmt = (d: Date) => d.toISOString().split('T')[0];
          onRangeSelect(fmt(selectionStart), fmt(clickedDate));
        } else {
          setError("Selection overlaps with an existing booking.");
        }
      }
    }
  };

  const isInSelection = (date: Date) => {
    if (!selectionStart) return false;
    if (selectionEnd) {
      return date >= selectionStart && date <= selectionEnd;
    }
    return date.getTime() === selectionStart.getTime();
  };

  const isInHover = (date: Date) => {
    if (!selectionStart || selectionEnd || !hoverDate) return false;
    if (hoverDate < selectionStart) return false;
    return date > selectionStart && date <= hoverDate;
  };

  const renderDays = () => {
    const days = [];
    // Padding for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-10" />);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const disabled = isDateDisabled(date);
      const selected = isInSelection(date);
      const inHover = !disabled && isInHover(date);
      
      let bgClass = "bg-white text-gray-700 hover:bg-gray-100";
      if (disabled) bgClass = "bg-gray-100 text-gray-300 cursor-not-allowed";
      else if (selected) bgClass = "bg-brand-lavender text-white";
      else if (inHover) bgClass = "bg-brand-lavender/30 text-brand-darkGrey";

      days.push(
        <button
          key={i}
          disabled={disabled}
          onClick={() => handleDateClick(i)}
          onMouseEnter={() => setHoverDate(date)}
          className={`h-10 w-full rounded-md flex items-center justify-center text-sm font-medium transition-colors ${bgClass}`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full max-w-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
        <span className="font-serif font-bold text-lg">{monthNames[month]} {year}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
          <div key={day} className="text-xs font-bold text-gray-400 uppercase">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Footer / Legend */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-4 text-xs text-gray-500 justify-center">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-lavender rounded-full"></div> Selected</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded-full"></div> Unavailable</div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
