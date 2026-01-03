import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ActivityCard from './ActivityCard';
import { format, parseISO } from 'date-fns';

const DayColumn = ({ date, activities, id, onUpdate, onDelete }) => {
    const { setNodeRef } = useDroppable({
        id: id,
        data: {
            type: 'DAY',
            date: date
        }
    });

    return (
        <div className="mb-8">
            <div className="sticky top-0 bg-gray-50 pt-2 pb-2 mb-2 z-10 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">
                    {format(parseISO(date), 'EEEE, MMMM d')}
                </h3>
            </div>

            <div ref={setNodeRef} className="min-h-[100px] p-2 rounded-lg bg-gray-100/50 border border-transparent hover:border-blue-200 transition-colors">
                <SortableContext
                    id={id}
                    items={activities.map(a => a.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {activities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                        {activities.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                                Drop activities here
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};

export default DayColumn;
