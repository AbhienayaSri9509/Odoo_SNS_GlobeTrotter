import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Plane } from 'lucide-react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import CreateTrip from './components/CreateTrip';
import MyTrips from './components/MyTrips';
import ItineraryBuilder from './components/CreateTrip/ItineraryBuilder';
import ItineraryView from './components/TripDetails/ItineraryView';
import ActivitySearch from './components/ActivitySearch/ActivitySearch';
import { supabase } from './lib/supabaseClient';

import PublicTripView from './components/PublicTrip/PublicTripView';
import ProfileView from './components/Profile/ProfileView';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminRoute from './components/Admin/AdminRoute';

function App() {
  const [session, setSession] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Theme Toggle Logic
  useEffect(() => {
    // Check system preference or localStorage
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // For Demo: Auto-login mock user if no real session
  const user = session?.user || { name: 'Alex', email: 'alex@example.com' };

  return (
    <div className="min-h-screen w-full relative overflow-hidden transition-colors duration-300">

      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-100/50 via-transparent to-brand-50/50 dark:from-brand-950/50 dark:to-gray-950"></div>
      </div>

      {/* Navbar (Condition: Show only if authenticated) */}
      {session && (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-transparent bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/50 hover:shadow-sm dark:hover:bg-gray-900/50">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
            <Plane className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">GlobalTrotters</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full bg-white/50 p-2.5 text-gray-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="rounded-full overflow-hidden w-10 h-10 border-2 border-white dark:border-gray-800 shadow-sm"
            >
              <img
                src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/public/trip/:tripId" element={<PublicTripView />} />

          {/* Auth Route */}
          <Route path="/login" element={
            !session ? (
              <div className="flex min-h-screen items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                  <AuthForm />
                </div>
              </div>
            ) : <Navigate to="/" />
          } />

          {/* Protected Routes */}
          <Route path="/" element={session ? <Dashboard user={user} darkMode={darkMode} /> : <Navigate to="/login" />} />
          <Route path="/create-trip" element={session ? <CreateTrip /> : <Navigate to="/login" />} />
          <Route path="/my-trips" element={session ? <MyTrips /> : <Navigate to="/login" />} />
          <Route path="/trip/:tripId/edit" element={session ? <ItineraryBuilder /> : <Navigate to="/login" />} />
          <Route path="/trip/:tripId" element={session ? <ItineraryView /> : <Navigate to="/login" />} />
          <Route path="/trip/:tripId/stop/:stopId/search" element={session ? <ActivitySearch /> : <Navigate to="/login" />} />

          {/* Profile Route */}
          <Route path="/profile" element={session ? <ProfileView darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" />} />

          {/* Admin Route */}
          <Route path="/admin" element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer Credentials */}
      {!session && location.pathname === '/login' && (
        <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-600">
          <p>© 2024 GlobalTrotters. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
