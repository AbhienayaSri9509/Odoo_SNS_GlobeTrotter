import React from 'react';
import PublicActivityCard from './PublicActivityCard';
import { format, parseISO } from 'date-fns';

const PublicItineraryTimeline = ({ activities }) => {
    const activitiesByDate = activities.reduce((acc, activity) => {
        const date = activity.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(activity);
        return acc;
    }, {});

    const sortedDates = Object.keys(activitiesByDate).sort();

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-10">
            {sortedDates.map((date) => (
                <div key={date}>
                    {/* Day Header */}
                    <div className="flex items-center gap-4 mb-6 sticky top-0 bg-white/90 backdrop-blur-sm py-3 z-10">
                        <div className="bg-blue-600 text-white font-bold rounded-lg px-3 py-1 shadow-sm">
                            Day {format(parseISO(date), 'd')}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {format(parseISO(date), 'EEEE, MMMM do')}
                        </h3>
                    </div>

                    {/* Activities Timeline */}
                    <div className="relative border-l-2 border-gray-100 pl-8 ml-4 space-y-6">
                        {activitiesByDate[date].map((activity) => (
                            <div key={activity.id} className="relative">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-white bg-blue-400 shadow-sm"></div>

                                <PublicActivityCard activity={activity} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {sortedDates.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">No activities planned for this trip yet.</p>
                </div>
            )}
        </div>
    );
};

export default PublicItineraryTimeline;
