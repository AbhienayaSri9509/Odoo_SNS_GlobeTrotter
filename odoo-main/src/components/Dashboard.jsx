import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass, TrendingUp } from 'lucide-react';
import Button from './ui/Button';
import PlacesSearch from './Dashboard/PlacesSearch';
import TripCard from './Dashboard/TripCard';
import DestinationCard from './Dashboard/DestinationCard';
import Chatbot from './Dashboard/Chatbot';

// Mock Data
const MOCK_TRIPS = [
    { id: 1, name: 'European Summer', startDate: 'Jul 10', endDate: 'Jul 24', cities: 4, budget: 3500 },
    { id: 2, name: 'Tokyo Adventure', startDate: 'Oct 05', endDate: 'Oct 14', cities: 2, budget: 2800 },
];

const MOCK_DESTINATIONS = [
    { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400' },
    { name: 'Reykjavik', country: 'Iceland', image: 'https://images.unsplash.com/photo-1528659576326-faae93674696?auto=format&fit=crop&q=80&w=400' },
];

const Dashboard = ({ user, darkMode }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-20 dark:bg-gray-950 lg:pl-64">
            {/* Sidebar spacer for mobile/desktop layout if we added a sidebar later */}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Welcome Section */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                            Welcome back, {user?.name || 'Explorer'} 👋
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            You have {MOCK_TRIPS.length} upcoming trips planned. <button onClick={() => navigate('/my-trips')} className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 hover:underline">View all</button>
                        </p>
                    </div>
                    <Button className="shrink-0 gap-2" onClick={() => navigate('/create-trip')}>
                        <Plus size={18} />
                        Plan New Trip
                    </Button>
                </div>

                {/* Hero Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Search Hero */}
                    <div className="lg:col-span-2">
                        <PlacesSearch />
                    </div>

                    {/* Budget / Stats */}
                    <div className="flex flex-col gap-6">
                        <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white shadow-lg">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-full bg-white/20 p-2">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="font-medium">Total Budget</h3>
                            </div>
                            <p className="text-3xl font-bold">$0</p>
                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/20">
                                <div className="h-full w-[0%] bg-white/90"></div>
                            </div>
                            <p className="mt-2 text-xs opacity-80">0% of yearly cap used</p>
                        </div>

                        <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Top Destinations</h3>
                                <Compass size={20} className="text-brand-500" />
                            </div>
                            <div className="mt-4 space-y-3">
                                {['Paris', 'Bali', 'New York'].map((city, i) => (
                                    <div key={city} className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0 dark:border-gray-800">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{i + 1}. {city}</span>
                                        <span className="text-xs font-medium text-green-500">+12%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Trips */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Adventures</h2>
                        <button
                            onClick={() => navigate('/my-trips')}
                            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {MOCK_TRIPS.map((trip, i) => (
                            <TripCard key={trip.id} trip={trip} index={i} />
                        ))}

                        {/* Add New PlaceHolder */}
                        <button
                            onClick={() => navigate('/create-trip')}
                            className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-700 dark:hover:bg-brand-900/20"
                        >
                            <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                                <Plus size={24} />
                            </div>
                            <span className="font-medium">Create New Trip</span>
                        </button>
                    </div>
                </div>



            </div>

            <Chatbot />
        </div>
    );
};

export default Dashboard;
