import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, DollarSign, MapPin, GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';

const ActivityCard = ({ activity, onUpdate, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: activity.id, data: { ...activity, type: 'ACTIVITY' } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        start_time: activity.start_time,
        end_time: activity.end_time,
        cost: activity.cost
    });

    const handleSave = () => {
        onUpdate && onUpdate(activity.id, editValues);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValues({
            start_time: activity.start_time,
            end_time: activity.end_time,
            cost: activity.cost
        });
        setIsEditing(false);
    };

    const handleDragPrevent = (e) => {
        // Prevent drag when interacting with form
        e.stopPropagation();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 mb-2 flex items-start gap-3 group hover:border-blue-300 transition-colors"
        >
            {/* Drag Handle */}
            {!isEditing && (
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
                >
                    <GripVertical size={16} />
                </button>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{activity.title}</h4>
                </div>

                {isEditing ? (
                    <div className="mt-2 text-xs space-y-2" onPointerDown={handleDragPrevent} onKeyDown={handleDragPrevent}>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={editValues.start_time}
                                onChange={(e) => setEditValues({ ...editValues, start_time: e.target.value })}
                                className="border rounded p-1"
                            />
                            <span>-</span>
                            <input
                                type="time"
                                value={editValues.end_time}
                                onChange={(e) => setEditValues({ ...editValues, end_time: e.target.value })}
                                className="border rounded p-1"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">$</span>
                            <input
                                type="number"
                                value={editValues.cost}
                                onChange={(e) => setEditValues({ ...editValues, cost: Number(e.target.value) })}
                                className="border rounded p-1 w-20"
                                placeholder="Cost"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <Check size={12} /> Save
                            </button>
                            <button onClick={handleCancel} className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                <X size={12} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{activity.start_time} - {activity.end_time}</span>
                            </div>
                            {activity.cost > 0 && (
                                <div className="flex items-center gap-1">
                                    <DollarSign size={12} />
                                    <span>${activity.cost}</span>
                                </div>
                            )}
                        </div>

                        {activity.city_name && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
                                <MapPin size={12} />
                                <span>{activity.city_name}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Actions (hover only) */}
            {!isEditing && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-gray-400 hover:text-blue-500 rounded"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete && onDelete(activity.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityCard;
