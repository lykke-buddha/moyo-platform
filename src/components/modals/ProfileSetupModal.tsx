'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
    const { user, updateProfile } = useAuth();
    const [country, setCountry] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Updating profile...");

        try {
            await updateProfile({
                country,
                bio
            });
            toast.success("Profile updated!", { id: toastId });
            onClose();
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-default">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="text-center mb-6 relative z-10">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-zinc-700 overflow-hidden">
                        <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Complete Your Profile</h2>
                    <p className="text-zinc-500 text-sm">Tell us a bit more about yourself, {user.displayName}.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Country</label>
                        <select
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 appearance-none"
                        >
                            <option value="">Select your country</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Kenya">Kenya</option>
                            <option value="South Africa">South Africa</option>
                            <option value="Uganda">Uganda</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Bio</label>
                        <textarea
                            required
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="What are you interested in?"
                            rows={3}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Finish Setup'}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-zinc-500 text-xs hover:text-zinc-300 mt-2"
                    >
                        Skip for now
                    </button>
                </form>
            </div>
        </div>
    );
}
