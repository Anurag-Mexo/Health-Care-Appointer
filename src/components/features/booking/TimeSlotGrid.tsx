import { addDays, format, isSameDay } from 'date-fns';

import { cn } from '../../../lib/utils';
import type { Doctor } from '../../../types';

interface TimeSlotGridProps {
  doctor: Doctor;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
}

export default function TimeSlotGrid({
  doctor,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime
}: TimeSlotGridProps) {
  
  // Generate next 14 days
  const upcomingDays = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));
  
  // Filter days based on doctor availability
  const availableDates = upcomingDays.filter(date => {
    const dayName = format(date, 'EEEE'); // e.g., 'Monday'
    return doctor.availableDays.includes(dayName);
  });

  // Mock time slots from 9 AM to 5 PM
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', 
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
    '04:00 PM', '04:30 PM'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 block">Select Date</h3>
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
          {availableDates.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date)}
                className={cn(
                  "snap-start shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all duration-200",
                  isSelected 
                    ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20" 
                    : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <span className="text-xs uppercase font-medium mt-1 opacity-80">{format(date, 'MMM')}</span>
                <span className="text-2xl font-bold my-0.5">{format(date, 'd')}</span>
                <span className="text-xs font-medium opacity-80">{format(date, 'EEE')}</span>
              </button>
            );
          })}
          {availableDates.length === 0 && (
            <p className="text-sm text-slate-500 py-4">No available dates found.</p>
          )}
        </div>
      </div>

      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 block">Available Time Slots</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {timeSlots.map(time => {
              const isSelected = selectedTime === time;
              // Randomly disable some slots to mock unavailability
              const isRandomlyBooked = Math.random() > 0.8;
              const isDisabled = isRandomlyBooked;

              return (
                <button
                  key={time}
                  disabled={isDisabled}
                  onClick={() => onSelectTime(time)}
                  className={cn(
                    "py-2.5 px-2 rounded-xl text-sm font-medium border transition-colors",
                    isDisabled 
                      ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed"
                      : isSelected
                        ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
