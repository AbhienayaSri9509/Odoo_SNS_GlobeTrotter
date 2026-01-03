import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { VIEW_MODES } from './constants';
import CalendarView from './CalendarView';
import TimelineView from './TimelineView';
import ActivityCard from './ActivityCard';
import { Calendar as CalendarIcon, List as ListIcon, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

const TripCalendar = () => {
    const { tripId } = useParams(); // Start utilizing tripId
    const [viewMode, setViewMode] = useState(VIEW_MODES.TIMELINE);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [dragOffset, setDragOffset] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchActivities();
    }, [tripId]);

    const fetchActivities = async () => {
        setLoading(true);
        if (!tripId) {
            // Fallback to mock data if no tripId (e.g. direct component view)
            // This line was removed as per the instruction to remove MOCK_ACTIVITIES usage.
            // If MOCK_ACTIVITIES is still desired as a fallback, it needs to be re-imported.
            setActivities([]); // Or some default empty state
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .eq('trip_id', tripId)
            .order('date', { ascending: true })
            .order('start_time', { ascending: true });

        if (error) {
            console.error('Error fetching activities:', error);
            // Fallback or error state
        } else {
            setActivities(data || []);
        }
        setLoading(false);
    };

    const updateActivityDate = async (id, newDate) => {
        const { error } = await supabase
            .from('activities')
            .update({ date: newDate })
            .eq('id', id);

        if (error) {
            console.error('Error updating activity date:', error);
            // Revert state if needed (not implemented for simplicity)
        }
    };

    const findContainer = (id) => {
        if (activities.find(a => a.date === id)) {
            return id;
        }
        const item = activities.find(a => a.id === id);
        return item ? item.date : null;
    };

    const activeItem = activeId ? activities.find(a => a.id === activeId) : null;

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId) || overId;

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setActivities((prev) => {
            // Create a copy to modify
            return prev.map(item => {
                if (item.id === activeId) {
                    return { ...item, date: overContainer };
                }
                return item;
            });
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const activeId = active.id;
        const overId = over ? over.id : null;

        if (!overId) {
            setActiveId(null);
            return;
        }

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId) || overId;

        // Check if we need to call DB update for date change
        // Since handleDragOver updates the state 'date' optimistically,
        // we just need to confirm if 'date' changed from original or just check current state vs DB.
        // However, handleDragOver updates local state.
        // We should identify if the container changed actually.
        // Optimization: we can check if the active item's date in 'activities' state matches the 'overContainer'.
        // Or simpler: just always update the date property in DB if it changed.

        // We already updated state in handleDragOver, so 'activities' already has the new date.
        // But we need to make sure reordering also works.

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeIndex = activities.findIndex(a => a.id === active.id);
            const overIndex = activities.findIndex(a => a.id === over.id);

            if (activeIndex !== overIndex) {
                setActivities((items) => arrayMove(items, activeIndex, overIndex));
                // Optional: Persist new order index to DB if you have an 'order' column
            }
        }

        // Persist date change
        const finalActivity = activities.find(a => a.id === active.id);
        if (finalActivity) {
            // In a real app we'd compare with original to save API calls,
            // but here we can just update.
            // Actually, if we just reordered in same list, date didn't change (usually).
            // But let's safe guard.
            if (finalActivity.date === overContainer || (overContainer && findContainer(overId) === overContainer)) {
                await updateActivityDate(active.id, finalActivity.date);
            }
        }

        setActiveId(null);
    };

    const updateActivityDetails = async (id, updates) => {
        // Optimistic update
        setActivities((prev) => prev.map(a => a.id === id ? { ...a, ...updates } : a));

        const { error } = await supabase
            .from('activities')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating activity:', error);
            // Revert logic (omitted)
        }
    };

    const deleteActivity = async (id) => {
        // Optimistic update
        setActivities((prev) => prev.filter(a => a.id !== id));

        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting activity:', error);
            // Revert
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm sticky top-0 z-20">
                <h1 className="text-xl font-bold text-gray-800">Trip Itinerary</h1>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode(VIEW_MODES.CALENDAR)}
                        className={`p-2 rounded-md transition-colors flex items-center gap-2 ${viewMode === VIEW_MODES.CALENDAR ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <CalendarIcon size={18} />
                        <span className="text-sm font-medium">Calendar</span>
                    </button>
                    <button
                        onClick={() => setViewMode(VIEW_MODES.TIMELINE)}
                        className={`p-2 rounded-md transition-colors flex items-center gap-2 ${viewMode === VIEW_MODES.TIMELINE ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ListIcon size={18} />
                        <span className="text-sm font-medium">Timeline</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="max-w-4xl mx-auto w-full">
                        {viewMode === VIEW_MODES.CALENDAR ? (
                            <CalendarView
                                activities={activities}
                                onDateClick={(date) => {
                                    // For now, maybe just log or alert,
                                    // or switch to Timeline view and scroll to date
                                }}
                            />
                        ) : (
                            <TimelineView
                                activities={activities}
                                onUpdate={updateActivityDetails}
                                onDelete={deleteActivity}
                            />
                        )}
                    </div>

                    {createPortal(
                        <DragOverlay>
                            {activeItem ? <ActivityCard activity={activeItem} /> : null}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>
        </div>
    );
};

export default TripCalendar;
