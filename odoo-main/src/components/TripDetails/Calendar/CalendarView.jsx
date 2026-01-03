import React, { useState } from 'react'; // Added import for useState
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calculator } from 'lucide-react'; // Fixed Calculator typo

const CalendarView = ({ activities, onDateClick }) => {
    // Use the first activity date or current date as initial view
    const initialDate = activities.length > 0 ? parseISO(activities[0].date) : new Date();
    const [currentMonth, setCurrentMonth] = useState(initialDate);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Helper to get activities for a day
    const getActivitiesForDay = (date) => {
        return activities.filter(activity => isSameDay(parseISO(activity.date), date));
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2 text-center text-sm font-medium text-gray-500">
                {weekDays.map(day => (
                    <div key={day} className="py-2">{day}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {days.map((day, dayIdx) => {
                    const dayActivities = getActivitiesForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isCurrentDay = isToday(day);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => onDateClick && onDateClick(day)}
                            className={`
                min-h-[100px] bg-white p-2 relative cursor-pointer hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'text-gray-900'}
                ${isCurrentDay ? 'bg-blue-50' : ''}
              `}
                        >
                            <div className={`
                flex items-center justify-center w-7 h-7 rounded-full text-sm
                ${isCurrentDay ? 'bg-blue-600 text-white font-bold' : ''}
              `}>
                                {format(day, 'd')}
                            </div>

                            {/* Activity Dots/Summary */}
                            <div className="mt-2 space-y-1">
                                {dayActivities.slice(0, 3).map(activity => (
                                    <div key={activity.id} className="text-xs truncate px-1 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                        {activity.title}
                                    </div>
                                ))}
                                {dayActivities.length > 3 && (
                                    <div className="text-xs text-gray-500 pl-1">
                                        + {dayActivities.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
