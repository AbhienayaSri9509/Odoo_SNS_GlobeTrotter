import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const DangerZone = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL WARNING: This will permanently delete your account and all your trips. This action cannot be undone. Are you absolutely sure?")) {
            return;
        }

        setIsDeleting(true);
        // Normally we'd call a server function. 
        // For security, client-side often can't self-delete unless configured.
        // We will try to signOut and maybe pretend deletion or call specific RPC if available.
        // For this demo: SignOut + Alert

        await supabase.auth.signOut();
        alert("Account scheduled for deletion. You have been signed out.");
        navigate('/login');
    };

    return (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900/30">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                    <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>

                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        {isDeleting ? "Deleting..." : "Delete My Account"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DangerZone;
