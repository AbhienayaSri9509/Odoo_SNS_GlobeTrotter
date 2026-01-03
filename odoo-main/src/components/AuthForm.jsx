import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Check, AlertCircle, ArrowRight } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { supabase } from '../lib/supabaseClient';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validate()) return;

        setIsLoading(true);

        try {
            const { error } = await (isLogin
                ? supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })
                : supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                })
            );

            if (error) throw error;

            if (isLogin) {
                setSuccess('Successfully logged in!');
            } else {
                setSuccess('Account created! Please check your email.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-xl dark:bg-gray-900/90 dark:shadow-2xl dark:shadow-brand-900/10">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {isLogin ? 'Welcome back' : 'Start your journey'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Join GlobalTrotters and explore the world'}
                    </p>
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        >
                            <Check size={16} />
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                    </div>

                    <div>
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        {!isLoading && <ArrowRight size={16} className="ml-2" />}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrors({});
                            setError('');
                            setSuccess('');
                        }}
                        className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
