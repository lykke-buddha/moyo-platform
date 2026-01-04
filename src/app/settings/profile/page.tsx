'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, User, AtSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Define the shape of our profile data
interface ProfileData {
    full_name: string;
    username: string;
    bio: string;
    website: string;
    avatar_url: string;
}

export default function ProfileSettingsPage() {
    const router = useRouter(); // Keeping router for consistency, though unused in snippet
    const { user, isLoading: authLoading } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [formData, setFormData] = useState<ProfileData>({
        full_name: '',
        username: '',
        bio: '',
        website: '',
        avatar_url: ''
    });

    useEffect(() => {
        // Wait for auth to initialize
        if (authLoading) return;

        // processing logic if not logged in
        if (!user) {
            // If this page is protected, we should redirect.
            // For now, let's just stop loading so the user sees *something* or is redirected.
            // In a real app: router.push('/login');
            setIsLoadingData(false);
            return;
        }

        async function loadProfile() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, username, bio, avatar_url')
                    .eq('id', user!.id)
                    .maybeSingle();

                if (data) {
                    setFormData({
                        full_name: data.full_name || user!.user_metadata?.full_name || '',
                        username: data.username || user!.user_metadata?.username || user!.email?.split('@')[0] || '',
                        bio: data.bio || '',
                        website: '',
                        avatar_url: data.avatar_url || user!.user_metadata?.avatar_url || ''
                    });
                } else {
                    // No profile found - use Auth Defaults
                    const defaults = {
                        full_name: user!.user_metadata?.full_name || user!.email?.split('@')[0] || '',
                        username: user!.user_metadata?.username || user!.email?.split('@')[0] || '',
                        avatar_url: user!.user_metadata?.avatar_url || ''
                    };

                    setFormData({
                        ...defaults,
                        bio: '',
                        website: ''
                    });

                    // Auto-create/Sync the profile row so other parts of the app (like Create Post) work immediately
                    // providing we have at least an ID.
                    await supabase.from('profiles').upsert({
                        id: user!.id,
                        full_name: defaults.full_name,
                        username: defaults.username,
                        avatar_url: defaults.avatar_url,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' });
                }
            } catch (err) {
                console.error('Unexpected error loading profile:', err);
            } finally {
                setIsLoadingData(false);
            }
        }

        loadProfile();
    }, [user, authLoading]);


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        try {
            // 1. Update public profile table (UPSERT to handle missing rows)
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id, // Required for upsert
                    full_name: formData.full_name,
                    username: formData.username,
                    bio: formData.bio,
                    avatar_url: formData.avatar_url,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (profileError) throw profileError;

            // 2. Update auth metadata (so Navbar updates immediately)
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.full_name,
                    username: formData.username,
                    avatar_url: formData.avatar_url
                }
            });

            if (authError) throw authError;

            alert('Profile updated successfully!');
            router.refresh();
        } catch (error) {
            let msg = 'An unexpected error occurred';
            if (error instanceof Error) msg = error.message;
            alert('Error updating profile: ' + msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('avatar-upload')?.click();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setIsSaving(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

            // Auto-save the new avatar immediately or just let user click save?
            // Let's just update the specific field in DB immediately for better UX
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            // Also update auth metadata
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            router.refresh();

        } catch (error) {
            let msg = 'Error uploading image';
            if (error instanceof Error) msg = error.message;
            alert(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

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
                    <div onClick={handleAvatarClick} className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800 ring-2 ring-zinc-800 group-hover:ring-amber-500 transition-all relative">
                            {formData.avatar_url ? (
                                <Image
                                    src={formData.avatar_url}
                                    alt="Profile"
                                    fill
                                    className="object-cover group-hover:opacity-75 transition-opacity"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-zinc-900 rounded-full p-1.5 border border-zinc-700 text-amber-500">
                            <Camera className="w-4 h-4" />
                        </div>
                        <input
                            type="file"
                            id="avatar-upload"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
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
                                value={formData.full_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
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
                        disabled={isSaving}
                        className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
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
