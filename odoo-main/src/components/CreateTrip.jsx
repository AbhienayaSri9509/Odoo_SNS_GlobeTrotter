import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Upload, X, Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from './ui/Button';
import Input from './ui/Input';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        coverImage: null
    });

    const [errors, setErrors] = useState({});

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Handle File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validations (Size < 5MB, Type Image)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, coverImage: 'Image must be smaller than 5MB' }));
            return;
        }

        setFormData(prev => ({ ...prev, coverImage: file }));
        setPreviewUrl(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, coverImage: '' }));
    };

    // Validation Logic
    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Trip name is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.endDate) < new Date(formData.startDate)) {
                newErrors.endDate = 'End date cannot be before start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('You must be logged in to create a trip');

            let coverImageUrl = null;

            // 2. Upload Image (if exists)
            if (formData.coverImage) {
                const fileExt = formData.coverImage.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                // Note: Ensure 'trip-covers' bucket exists in Supabase Storage
                const { error: uploadError, data } = await supabase.storage
                    .from('trip-covers')
                    .upload(fileName, formData.coverImage);

                if (uploadError) {
                    console.warn("Image upload failed, continuing without image.", uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('trip-covers')
                        .getPublicUrl(fileName);
                    coverImageUrl = publicUrl;
                }
            }

            // 3. Insert Trip Data
            const { data: newTrip, error: insertError } = await supabase
                .from('trips')
                .insert([
                    {
                        user_id: user.id,
                        name: formData.name,
                        start_date: formData.startDate,
                        end_date: formData.endDate,
                        description: formData.description,
                        cover_image: coverImageUrl,
                        status: 'planned'
                    }
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            // 4. Success & Redirect
            navigate(`/trip/${newTrip.id}/edit`);

        } catch (err) {
            console.error('Error creating trip:', err);
            setErrors(prev => ({ ...prev, submit: err.message || 'Failed to create trip. Please try again.' }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24 dark:bg-gray-950">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan a New Trip</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start your next adventure</p>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
                >
                    {/* Cover Image Uploader */}
                    <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Cover Preview" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/20" />
                                <button
                                    onClick={() => { setPreviewUrl(null); setFormData(p => ({ ...p, coverImage: null })); }}
                                    className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                                <ImageIcon size={32} />
                                <span className="text-sm font-medium">Upload Cover Photo</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="space-y-6">

                            {/* Trip Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Trip Name</label>
                                <Input
                                    icon={MapPin}
                                    placeholder="e.g. Summer in Italy"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className={`w-full rounded-xl border bg-gray-50 px-10 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${errors.startDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-brand-500 focus:ring-brand-100 dark:border-gray-700'
                                                }`}
                                        />
                                    </div>
                                    {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className={`w-full rounded-xl border bg-gray-50 px-10 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${errors.endDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-brand-500 focus:ring-brand-100 dark:border-gray-700'
                                                }`}
                                        />
                                    </div>
                                    {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="What are you getting up to?"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                                />
                            </div>

                            {/* Global Error */}
                            <AnimatePresence>
                                {errors.submit && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                    >
                                        {errors.submit}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-32"
                                >
                                    <Save size={18} className="mr-2" />
                                    Save Trip
                                </Button>
                            </div>

                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateTrip;
