'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, User, Mail, AtSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CURRENT_USER } from '@/lib/mockData';

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, we'd use 'user' from context, but falling back to mock DATA if context is limited
    const [formData, setFormData] = useState({
        name: user?.name || CURRENT_USER.name || 'User Name',
        username: user?.email ? user.email.split('@')[0] : (CURRENT_USER.handle?.replace('@', '') || 'username'),
        bio: 'Digital creator & artist based in Nairobi. Sharing my life and art with the world.',
        website: 'https://moyo.africa/user'
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        alert('Profile updated successfully!');
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-zinc-100">Personal Information</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800 ring-2 ring-zinc-800 group-hover:ring-amber-500 transition-all">
                            <img
                                src={CURRENT_USER.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-zinc-900 rounded-full p-1.5 border border-zinc-700 text-amber-500">
                            <Camera className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500">Tap to change profile photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Display Name</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Username / Handle</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                <AtSign className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600 min-h-[100px] resize-none"
                            placeholder="Tell your story..."
                            maxLength={160}
                        />
                        <div className="text-right text-xs text-zinc-600 px-1">
                            {formData.bio.length}/160
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
