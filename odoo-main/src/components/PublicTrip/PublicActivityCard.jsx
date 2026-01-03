import React from 'react';
import { Clock, DollarSign, MapPin } from 'lucide-react';

const PublicActivityCard = ({ activity }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-800 text-base">{activity.title}</h4>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    <span>{activity.start_time} - {activity.end_time}</span>
                </div>

                {activity.cost > 0 && (
                    <div className="flex items-center gap-1.5">
                        <DollarSign size={14} className="text-gray-400" />
                        <span>${activity.cost}</span>
                    </div>
                )}

                {activity.city_name && (
                    <div className="flex items-center gap-1.5 text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                        <MapPin size={12} />
                        <span>{activity.city_name}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicActivityCard;
