import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';

const DestinationCard = ({ city, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="group relative h-48 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
        >
            <img
                src={city.image}
                alt={city.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-bold text-white">{city.name}</h4>
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs text-gray-300">
                        <MapPin size={12} />
                        {city.country}
                    </p>
                    <button
                        onClick={() => window.location.href = '/create-trip'} // Using href for simple demo nav, or pass navigate prop if preferred
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-brand-500"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DestinationCard;
