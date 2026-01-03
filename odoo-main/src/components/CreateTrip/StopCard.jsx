import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Plus, ChevronDown, ChevronUp, GripVertical, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

// Mock Activity Item (Internal Component)
const ActivityItem = ({ activity, onDelete }) => (
    <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
    >
        <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${activity.category === 'food' ? 'bg-orange-400' :
                activity.category === 'adventure' ? 'bg-green-400' : 'bg-blue-400'
                }`} />
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.cost ? `$${activity.cost}` : 'Free'} • {activity.category}
                </p>
            </div>
        </div>
        <button
            onClick={() => onDelete(activity.id)}
            className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
        >
            <Trash2 size={14} />
        </button>
    </motion.div>
);

const StopCard = ({ stop, onAddActivity, onDeleteActivity, onDeleteStop }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const { tripId } = useParams();

    const handleAddClick = () => {
        // If we want to use the quick prompt from before, use onAddActivity(stop.id)
        // BUT for the new search screen, navigate to it:
        navigate(`/trip/${tripId}/stop/${stop.id}/search`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                    <div className="cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300">
                        <GripVertical size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin size={16} className="text-brand-500" />
                            {stop.city}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={12} />
                            <span>{stop.startDate} - {stop.endDate}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDeleteStop(stop.id)}
                        className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        title="Delete Stop"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-full bg-gray-50 p-2 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Content (Activities) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="p-4"
                    >
                        <div className="space-y-3">
                            {stop.activities && stop.activities.length > 0 ? (
                                stop.activities.map(activity => (
                                    <ActivityItem
                                        key={activity.id}
                                        activity={activity}
                                        onDelete={(actId) => onDeleteActivity(stop.id, actId)}
                                    />
                                ))
                            ) : (
                                <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-600">
                                    No activities added yet.
                                </div>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed text-xs"
                                onClick={handleAddClick}
                            >
                                <Plus size={14} className="mr-1" />
                                Add Activity
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StopCard;
