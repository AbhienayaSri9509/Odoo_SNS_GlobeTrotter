import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import ProfileInfoCard from './ProfileInfoCard';
import PreferencesPanel from './PreferencesPanel';
import SavedDestinationsList from './SavedDestinationsList';
import PrivacySettings from './PrivacySettings';
import DangerZone from './DangerZone';
import { Shield, Settings, User } from 'lucide-react';

const ProfileView = ({ darkMode, setDarkMode }) => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile, preferences, and account security.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3">
                        <nav className="space-y-1 sticky top-24">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'general' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                                <User size={18} />
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'preferences' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                                <Settings size={18} />
                                Preferences
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'security' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                                <Shield size={18} />
                                Privacy & Security
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8">
                        {activeTab === 'general' && (
                            <>
                                <ProfileInfoCard user={user} />
                                <SavedDestinationsList />
                            </>
                        )}
                        {activeTab === 'preferences' && (
                            <>
                                <PreferencesPanel darkMode={darkMode} setDarkMode={setDarkMode} />
                            </>
                        )}
                        {activeTab === 'security' && (
                            <>
                                <PrivacySettings />
                                <DangerZone />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
