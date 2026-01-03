import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar as CalendarIcon, List, MapPin, Clock, DollarSign, Share2, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';

// Dummy Data for Timeline
const MOCK_ITINERARY = [
    {
        day: 1,
        date: '2024-07-10',
        city: 'Paris, France',
        activities: [
            { id: 1, name: 'Arrival & Check-in', time: '10:00 AM', cost: 0, category: 'logistics' },
            { id: 2, name: 'Eiffel Tower Tour', time: '02:00 PM', cost: 30, category: 'sightseeing' },
            { id: 3, name: 'Dinner at Le Jules Verne', time: '07:30 PM', cost: 120, category: 'food' }
        ]
    },
    {
        day: 2,
        date: '2024-07-11',
        city: 'Paris, France',
        activities: [
            { id: 4, name: 'Louvre Museum', time: '09:00 AM', cost: 17, category: 'sightseeing' },
            { id: 5, name: 'Seine River Cruise', time: '05:00 PM', cost: 20, category: 'adventure' }
        ]
    }
];

const TimelineView = ({ itinerary }) => (
    <div className="space-y-8">
        {itinerary.map((day, index) => (
            <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative border-l-2 border-brand-200 pl-8 dark:border-brand-900"
            >
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-brand-500 ring-4 ring-white dark:ring-gray-950" />

                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Day {day.day} - {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin size={14} />
                        <span>{day.city}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {day.activities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.category === 'food' ? 'bg-orange-100 text-orange-600' :
                                        activity.category === 'sightseeing' ? 'bg-purple-100 text-purple-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">{activity.name}</h4>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {activity.cost > 0 ? `$${activity.cost}` : 'Free'}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        ))}
    </div>
);

const CalendarView = ({ itinerary }) => (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {itinerary.map((day, index) => (
            <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
                <div className="mb-3 border-b border-gray-100 pb-2 dark:border-gray-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Day {day.day}</span>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</h4>
                    <p className="text-xs text-gray-500 truncate">{day.city}</p>
                </div>
                <div className="flex-1 space-y-2">
                    {day.activities.map(activity => (
                        <div key={activity.id} className="truncate rounded bg-gray-50 p-2 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            • {activity.name}
                        </div>
                    ))}
                </div>
            </motion.div>
        ))}
    </div>
);

const ItineraryView = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch trip details (Mock for now, would be from Supabase)
        const fetchTrip = async () => {
            // In real app: fetch from DB, then format into MOCK_ITINERARY structure
            // For demo: verify trip exists via ID then use mock itinerary
            try {
                const { data } = await supabase.from('trips').select('*').eq('id', tripId).single();
                setTrip(data || { name: 'European Summer', start_date: '2024-07-10', end_date: '2024-07-24' });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [tripId]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/my-trips')}
                                className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{trip?.name || 'Loading...'}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {trip && `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => navigate(`/trip/${tripId}/edit`)}>
                                <Edit3 size={16} className="mr-2" />
                                Edit Plan
                            </Button>
                            <Button onClick={() => alert("Share feature coming soon!")}>
                                <Share2 size={16} className="mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* View Controls */}
                    <div className="flex w-full max-w-xs rounded-lg bg-white p-1 shadow-sm dark:bg-gray-900">
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${viewMode === 'timeline'
                                    ? 'bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-900/20 dark:text-brand-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                }`}
                        >
                            <List size={16} />
                            Timeline
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${viewMode === 'calendar'
                                    ? 'bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-900/20 dark:text-brand-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                }`}
                        >
                            <CalendarIcon size={16} />
                            Calendar
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-20 text-center text-gray-500">Loading itinerary...</div>
                ) : (
                    <div className="min-h-[400px]">
                        {viewMode === 'timeline' ? (
                            <TimelineView itinerary={MOCK_ITINERARY} />
                        ) : (
                            <CalendarView itinerary={MOCK_ITINERARY} />
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ItineraryView;
