import React from 'react';
import { Users, Briefcase, Activity, TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
                <TrendingUp size={16} className={change < 0 ? 'rotate-180' : ''} />
            </div>
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
    </div>
);

const StatsCards = ({ stats }) => {
    // Safe default if stats are loading/undefined
    const {
        totalUsers = 0,
        totalTrips = 0,
        activeUsers = 0,
        avgTrips = 0
    } = stats || {};

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="Total Users"
                value={totalUsers.toLocaleString()}
                change={12.5}
                icon={Users}
                color="bg-blue-500"
            />
            <StatsCard
                title="Total Trips"
                value={totalTrips.toLocaleString()}
                change={8.2}
                icon={Briefcase}
                color="bg-purple-500"
            />
            <StatsCard
                title="Active Users (30d)"
                value={activeUsers.toLocaleString()}
                change={-2.4}
                icon={Activity}
                color="bg-orange-500"
            />
            <StatsCard
                title="Avg. Trips / User"
                value={avgTrips.toFixed(1)}
                change={5.7}
                icon={TrendingUp}
                color="bg-emerald-500"
            />
        </div>
    );
};

export default StatsCards;
