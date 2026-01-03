import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Plus, Loader2, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import TripCard from './Dashboard/TripCard';

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Trips on mount
    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Should not happen due to protected route, but safety check
                return;
            }

            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id)
                .order('start_date', { ascending: true });

            if (error) throw error;
            setTrips(data || []);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (tripId) => {
        if (!window.confirm("Are you sure you want to delete this trip?")) return;

        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', tripId);

            if (error) throw error;

            // Remove from local state
            setTrips(prev => prev.filter(t => t.id !== tripId));
        } catch (err) {
            console.error('Error deleting trip:', err);
            alert("Failed to delete trip");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Trips</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your upcoming adventures</p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/create-trip')} className="shrink-0 gap-2">
                        <Plus size={18} />
                        Create New Trip
                    </Button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-brand-500" />
                    </div>
                ) : (
                    <>
                        {trips.length === 0 ? (
                            /* Empty State */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900/50"
                            >
                                <div className="mb-4 rounded-full bg-brand-50 p-6 dark:bg-brand-900/20">
                                    <Plus size={32} className="text-brand-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No trips found</h3>
                                <p className="mt-1 max-w-sm text-gray-500 dark:text-gray-400">
                                    You haven't planned any trips yet. Start your journey by creating a new adventure!
                                </p>
                                <Button onClick={() => navigate('/create-trip')} className="mt-6">
                                    Start Planning
                                </Button>
                            </motion.div>
                        ) : (
                            /* Trip Grid */
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {trips.map((trip, i) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={trip}
                                        index={i}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
