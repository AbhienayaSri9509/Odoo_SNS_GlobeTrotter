import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Edit2, Trash2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, index, onDelete }) => {
    const navigate = useNavigate();

    // Format dates if they exist (DB format is YYYY-MM-DD)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
            {/* Cover Image or Placeholder */}
            <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {trip.cover_image ? (
                    <img src={trip.cover_image} alt={trip.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <MapPin size={40} className="opacity-20" />
                    </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}/edit`); }}
                        className="rounded-full bg-white/90 p-2 text-gray-600 shadow-sm backdrop-blur-sm hover:text-brand-600 dark:bg-gray-900/80 dark:text-gray-300"
                        title="Edit Itinerary"
                    >
                        <Edit2 size={16} />
                    </button>
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
                            className="rounded-full bg-white/90 p-2 text-red-400 shadow-sm backdrop-blur-sm hover:text-red-600 dark:bg-gray-900/80 dark:text-red-400"
                            title="Delete Trip"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-4">
                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-white">{trip.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {trip.description || 'No description provided.'}
                    </p>
                </div>

                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar size={16} className="text-brand-500" />
                        <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                    </div>
                    {/* Placeholder for budget if added to DB later */}
                    {trip.budget && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <DollarSign size={16} className="text-brand-500" />
                            <span>est. ${trip.budget}</span>
                        </div>
                    )}
                </div>

                <Button
                    onClick={() => navigate(`/trip/${trip.id}`)}
                    variant="outline"
                    className="mt-4 w-full justify-between hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-500 dark:hover:text-brand-400"
                >
                    View Details
                    <ArrowRight size={16} />
                </Button>
            </div>
        </motion.div>
    );
};

export default TripCard;
