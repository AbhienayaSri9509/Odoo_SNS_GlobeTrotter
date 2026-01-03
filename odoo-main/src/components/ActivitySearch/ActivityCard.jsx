import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Clock, DollarSign, Star, Info } from 'lucide-react';
import Button from '../ui/Button';

const ActivityCard = ({ activity, onAdd, isAdded, onOpenDetails }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 ${isAdded ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-800'
                }`}
        >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={activity.image}
                    alt={activity.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
                    {activity.category}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activity.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{activity.rating}</span>
                    </div>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        <span>{activity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <DollarSign size={14} />
                        <span>{activity.costLabel} ({activity.cost > 0 ? `$${activity.cost}` : 'Free'})</span>
                    </div>
                </div>

                <div className="mt-auto flex gap-2">
                    <Button
                        variant={isAdded ? "secondary" : "primary"}
                        className={`flex-1 ${isAdded ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400' : ''}`}
                        onClick={() => onAdd(activity)}
                    >
                        {isAdded ? (
                            <>
                                <Check size={16} className="mr-2" />
                                Added
                            </>
                        ) : (
                            <>
                                <Plus size={16} className="mr-2" />
                                Add
                            </>
                        )}
                    </Button>
                    <button
                        onClick={() => onOpenDetails(activity)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                        <Info size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ActivityCard;
