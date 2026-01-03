import React, { useState } from 'react';
import { Lock, Eye, Copy } from 'lucide-react';

const PrivacySettings = () => {
    const [isPublicDefault, setIsPublicDefault] = useState(false);
    const [allowCopy, setAllowCopy] = useState(true);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Account</h2>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 h-fit">
                            <Eye size={20} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Public Profile</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Allow others to see your travels and saved destinations on your public profile page.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPublicDefault} onChange={(e) => setIsPublicDefault(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400 h-fit">
                            <Copy size={20} />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Allow Trip Copying</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">Let other users copy your public itineraries to their own account.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={allowCopy} onChange={(e) => setAllowCopy(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
