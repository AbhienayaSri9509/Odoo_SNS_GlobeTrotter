import React from 'react';
import DayColumn from './DayColumn';

const TimelineView = ({ activities, onUpdate, onDelete }) => {
    const activitiesByDate = activities.reduce((acc, activity) => {
        const date = activity.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(activity);
        return acc;
    }, {});

    const sortedDates = Object.keys(activitiesByDate).sort();

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            {sortedDates.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No activities. Add some to get started!
                </div>
            ) : (
                sortedDates.map(date => (
                    <DayColumn
                        key={date}
                        id={date}
                        date={date}
                        activities={activitiesByDate[date]}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                ))
            )}
        </div>
    );
};

export default TimelineView; // Re-writing the whole file to be safe
