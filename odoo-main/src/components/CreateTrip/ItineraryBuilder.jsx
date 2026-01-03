import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';
import StopCard from './StopCard';

// Dummy data for initial dev if no DB data
const MOCK_STOPS = [
    {
        id: '1',
        city: 'Paris, France',
        startDate: '2024-07-10',
        endDate: '2024-07-14',
        activities: [
            { id: 'a1', name: 'Eiffel Tower Visit', category: 'sightseeing', cost: 30 },
            { id: 'a2', name: 'Seine River Cruise', category: 'adventure', cost: 20 }
        ]
    },
    {
        id: '2',
        city: 'London, UK',
        startDate: '2024-07-15',
        endDate: '2024-07-18',
        activities: []
    }
];

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [stops, setStops] = useState(MOCK_STOPS);
    const [tripDetails, setTripDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Trip Details
    useEffect(() => {
        const fetchTrip = async () => {
            setIsLoading(true);
            try {
                // In a real app, we would fetch stops from 'stops' table
                // For this demo, we use mock stops but fetch trip basic info
                const { data, error } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('id', tripId)
                    .single();

                if (error) {
                    // Only throw if it's not a "row not found" (which might happen if ID is mock)
                    if (error.code !== 'PGRST116') console.warn(error);
                }

                if (data) setTripDetails(data);
                else setTripDetails({ name: 'My Trip', start_date: '...', end_date: '...' });

            } catch (err) {
                console.error("Error loading trip:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrip();
    }, [tripId]);


    // Handlers
    const handleAddStop = () => {
        const city = prompt("Enter city name (e.g., Tokyo):");
        if (!city) return;

        const newStop = {
            id: Date.now().toString(),
            city,
            startDate: 'TBD',
            endDate: 'TBD',
            activities: []
        };
        setStops([...stops, newStop]);
    };

    const handleDeleteStop = (stopId) => {
        if (confirm("Delete this stop?")) {
            setStops(stops.filter(s => s.id !== stopId));
        }
    };

    const handleAddActivity = (stopId) => {
        const name = prompt("Activity Name:");
        if (!name) return;

        setStops(stops.map(stop => {
            if (stop.id === stopId) {
                const newActivity = {
                    id: Date.now().toString(),
                    name,
                    category: 'sightseeing',
                    cost: 0
                };
                return { ...stop, activities: [...stop.activities, newActivity] };
            }
            return stop;
        }));
    };

    const handleDeleteActivity = (stopId, activityId) => {
        setStops(stops.map(stop => {
            if (stop.id === stopId) {
                return {
                    ...stop,
                    activities: stop.activities.filter(a => a.id !== activityId)
                };
            }
            return stop;
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Prepare Activities
            // Flatten all activities from all stops
            const allActivities = stops.flatMap(stop =>
                stop.activities.map(activity => ({
                    trip_id: tripId,
                    title: activity.name, // Mapping 'name' to 'title' as per PublicTripView schema inference
                    city_name: stop.city,
                    cost: parseFloat(activity.cost) || 0,
                    category: activity.category,
                    // We need dates. If stop has dates, use them, or default? 
                    // For now, assuming activity dates match stop dates or are TBD.
                    // Ideally UI allows setting specific date/time. 
                    // We'll map what we have.
                    // Note: 'id' - if it's new (numeric timestamp string), let DB handle or keep it?
                    // Supabase upsert needs real UUIDs or we omit ID for new ones.
                    // If ID is short string (e.g. '170...'), treat as new?
                    // Safe bet: omit ID if it looks temporary, or pass it if you want client-generated IDs.
                    // For simplicity in this demo: we won't send ID for new items, let DB gen.
                }))
            );

            // 2. Prepare Trip Updates (Cities list)
            const cityNames = stops.map(s => s.city);

            // 3. Perform Updates

            // A. Update Trip Cities
            const { error: tripError } = await supabase
                .from('trips')
                .update({ cities: cityNames }) // Saving cities array/json
                .eq('id', tripId);

            if (tripError) throw tripError;

            // B. Save Activities
            // Delete existing first? Or Upsert? 
            // Simple approach for this builder: Replace all for this trip (Delete all, then Insert)
            // This avoids complex diffing for specific edits/deletes.

            // i. Delete old
            const { error: deleteError } = await supabase
                .from('activities')
                .delete()
                .eq('trip_id', tripId);

            if (deleteError) throw deleteError;

            // ii. Insert new (if any)
            if (allActivities.length > 0) {
                const { error: insertError } = await supabase
                    .from('activities')
                    .insert(allActivities);

                if (insertError) throw insertError;
            }

            alert("Itinerary saved successfully!");
            navigate(`/trip/${tripId}`); // Go to view mode

        } catch (err) {
            console.error("Error saving itinerary:", err);
            alert("Failed to save itinerary.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/my-trips')}
                            className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            {isLoading ? (
                                <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tripDetails?.name || 'Untitled Trip'}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {tripDetails?.start_date ? new Date(tripDetails.start_date).toLocaleDateString() : ''} -
                                        {tripDetails?.end_date ? new Date(tripDetails.end_date).toLocaleDateString() : ''}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} className="shrink-0 gap-2">
                        <Save size={18} />
                        Save Itinerary
                    </Button>
                </div>

                {/* Itinerary Area */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Itinerary</h2>
                        <Button variant="outline" size="sm" onClick={handleAddStop}>
                            <Plus size={16} className="mr-2" />
                            Add Stop
                        </Button>
                    </div>

                    <Reorder.Group axis="y" values={stops} onReorder={setStops} className="space-y-4">
                        {stops.map((stop) => (
                            <Reorder.Item key={stop.id} value={stop} dragListener={false}>
                                <StopCard
                                    stop={stop}
                                    onAddActivity={handleAddActivity}
                                    onDeleteActivity={handleDeleteActivity}
                                    onDeleteStop={handleDeleteStop}
                                />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {stops.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-800 dark:bg-gray-900/50">
                            <p className="text-gray-500 dark:text-gray-400">No stops yet. Add your first destination!</p>
                            <Button variant="ghost" onClick={handleAddStop} className="mt-2 text-brand-500 hover:text-brand-600">
                                + Add Stop
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ItineraryBuilder;
