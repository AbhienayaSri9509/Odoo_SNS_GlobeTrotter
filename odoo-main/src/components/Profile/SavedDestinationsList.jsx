import React from 'react';
import { MapPin, X } from 'lucide-react';

const SavedDestinationsList = () => {
    // Mock data for now
    const saved = [
        { id: 1, city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
        { id: 2, city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Saved Destinations</h2>

            {saved.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {saved.map(item => (
                        <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-video">
                            <img src={item.image} alt={item.city} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 text-white">
                                <p className="font-bold text-lg">{item.city}</p>
                                <div className="flex items-center gap-1 text-xs opacity-80">
                                    <MapPin size={12} />
                                    <span>{item.country}</span>
                                </div>
                            </div>
                            <button className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No saved destinations yet.
                </div>
            )}
        </div>
    );
};

export default SavedDestinationsList;
