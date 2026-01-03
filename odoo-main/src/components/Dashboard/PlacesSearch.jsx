import React, { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const PlacesSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResults([]);

        try {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey) throw new Error("Missing Google Maps API Key");

            // Using Google Places API (New) Text Search
            const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.types'
                },
                body: JSON.stringify({
                    textQuery: query,
                    maxResultCount: 5
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.places) {
                const uniqueResults = data.places.map(place => ({
                    id: place.id,
                    name: place.displayName.text,
                    address: place.formattedAddress,
                    type: place.types ? place.types[0].replace(/_/g, ' ') : 'Location'
                }));
                setResults(uniqueResults);
            } else {
                setResults([]);
            }

        } catch (err) {
            console.error("Search Error:", err);
            // Fallback for demo if API fails (e.g. CORS or Invalid Key)
            setResults([
                { id: 'error', name: 'Search Failed', address: err.message, type: 'Error' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021"
                    alt="Travel Background"
                    className="h-full w-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                        Where to next?
                    </h2>
                    <p className="mb-8 text-lg text-gray-200">
                        Discover your next adventure with our AI-powered planner.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    onSubmit={handleSearch}
                    className="flex w-full max-w-2xl flex-col items-center gap-2 sm:flex-row"
                >
                    <div className="relative w-full">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search destinations, hotels, or attractions..."
                            className="w-full rounded-xl border-0 bg-white/95 px-12 py-4 text-gray-900 shadow-lg outline-none backdrop-blur-sm placeholder:text-gray-500 focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="h-14 w-full rounded-xl bg-brand-600/90 text-lg font-semibold hover:bg-brand-500 backdrop-blur-sm sm:w-auto sm:px-8"
                    >
                        Explore
                    </Button>
                </motion.form>

                {/* Search Results Dropdown (Demo) */}
                <AnimatePresence>
                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-4 w-full max-w-2xl overflow-hidden rounded-xl bg-white/95 text-left shadow-xl backdrop-blur-md dark:bg-gray-800/95"
                        >
                            <div className="p-2">
                                {results.map((result) => (
                                    <div
                                        key={result.id}
                                        className="flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => alert(`Selected: ${result.name}`)}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{result.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{result.address}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <Navigation size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PlacesSearch;
