import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, X } from 'lucide-react';
import Button from '../ui/Button';
import ActivityCard from './ActivityCard';
import { supabase } from '../../lib/supabaseClient';

const MOCK_ACTIVITIES = [
    { id: 1, name: 'Louvre Museum', category: 'Sightseeing', duration: '3-4 hours', cost: 17, costLabel: 'Medium', rating: 4.8, image: 'https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Eiffel Tower Summit', category: 'Sightseeing', duration: '2-3 hours', cost: 30, costLabel: 'High', rating: 4.7, image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Seine River Cruise', category: 'Relaxation', duration: '1 hour', cost: 15, costLabel: 'Low', rating: 4.5, image: 'https://images.unsplash.com/photo-1551163536-cb7c34b8296a?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Montmartre Food Tour', category: 'Food', duration: '3 hours', cost: 85, costLabel: 'High', rating: 4.9, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Luxembourg Gardens', category: 'Nature', duration: '1-2 hours', cost: 0, costLabel: 'Free', rating: 4.6, image: 'https://images.unsplash.com/photo-1558235478-f7c57069796e?auto=format&fit=crop&q=80&w=400' },
];

const ActivitySearch = () => {
    const { tripId, stopId } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [addedActivities, setAddedActivities] = useState([]);

    // Filter Logic
    const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Sightseeing', 'Food', 'Nature', 'Relaxation'];

    const handleAddActivity = (activity) => {
        // Toggle add/remove
        if (addedActivities.find(a => a.id === activity.id)) {
            setAddedActivities(prev => prev.filter(a => a.id !== activity.id));
        } else {
            setAddedActivities(prev => [...prev, activity]);
        }
    };

    const handleSaveToItinerary = async () => {
        // In real app, save 'addedActivities' to Supabase linked to 'stopId'
        // For now, we mock the delay and navigate back
        alert(`Saved ${addedActivities.length} activities to your itinerary!`);
        navigate(`/trip/${tripId}/edit`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sticky top-20 z-40 bg-gray-50/95 py-4 backdrop-blur dark:bg-gray-950/95 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Activities</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Find the best things to do in Paris (Mock)</p>
                        </div>
                    </div>

                    {addedActivities.length > 0 && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                {addedActivities.length} selected
                            </span>
                            <Button onClick={handleSaveToItinerary} className="shrink-0 gap-2">
                                Done
                            </Button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-brand-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredActivities.map(activity => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            onAdd={() => handleAddActivity(activity)}
                            isAdded={!!addedActivities.find(a => a.id === activity.id)}
                            onOpenDetails={() => alert(`Details for ${activity.name}`)}
                        />
                    ))}
                </div>

                {filteredActivities.length === 0 && (
                    <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                        No activities found matching your search.
                    </div>
                )}

            </div>
        </div>
    );
};

export default ActivitySearch;
