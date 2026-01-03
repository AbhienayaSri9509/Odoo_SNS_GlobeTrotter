import React from 'react';
import { Calendar, Map, Wallet, Share2, Copy } from 'lucide-react';

const PublicTripHeader = ({ trip, onCopyTrip }) => {
    return (
        <div className="relative bg-gray-900 text-white py-20 px-6">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
                {/* Placeholder for random travel image if no cover */}
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
                    alt="Travel Cover"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="relative z-20 max-w-4xl mx-auto text-center">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium backdrop-blur-sm border border-blue-500/30">
                    Shared Itinerary
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
                    {trip.name}
                </h1>

                <div className="flex flex-wrap justify-center gap-6 text-gray-200 mb-10 text-sm md:text-base">
                    {trip.start_date && (
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{trip.start_date} — {trip.end_date}</span>
                        </div>
                    )}
                    {trip.cities && (
                        <div className="flex items-center gap-2">
                            <Map size={18} />
                            <span>{trip.cities.length} Cities</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={onCopyTrip}
                        className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Copy size={18} />
                        Copy Trip to My Account
                    </button>

                    <button
                        onClick={() => {
                            const url = window.location.href;
                            if (navigator.share) {
                                navigator.share({
                                    title: `Trip to ${trip.name}`,
                                    text: 'Check out this amazing itinerary on GlobalTrotters!',
                                    url: url
                                }).catch(console.error);
                            } else {
                                navigator.clipboard.writeText(url);
                                alert('Link copied to clipboard!');
                            }
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full backpack-blur-sm transition-colors flex items-center gap-2 backdrop-blur-md"
                    >
                        <Share2 size={18} />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicTripHeader;
