import React from 'react';
import { Moon, Sun, Globe } from 'lucide-react';

const PreferencesPanel = ({ darkMode, setDarkMode }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>

            <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Appearance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Customize how GlobalTrotters looks on your device</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setDarkMode(false)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!darkMode ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setDarkMode(true)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${darkMode ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                {/* Language */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Language</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
                        </div>
                    </div>

                    <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-white px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PreferencesPanel;
