'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Share2, Mail, MapPin, Link as LinkIcon, Lock, MoreHorizontal, ArrowLeft, Check, ImageOff, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const { user: currentUser } = useAuth();

    // Check if params.handle is string or array. If array, use first element.
    const rawHandle = params?.handle;
    const handle = (Array.isArray(rawHandle) ? rawHandle[0] : rawHandle) || ''; // Handle potentially undefined or array

    // Clean handle (remove @ if present)
    const username = decodeURIComponent(handle).replace('@', '');

    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        async function fetchProfileAndPosts() {
            if (!username) return;
            setIsLoading(true);
            try {
                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    // It might not exist
                    setProfile(null);
                } else {
                    setProfile(profileData);

                    // Check ownership
                    if (currentUser && currentUser.id === profileData.id) {
                        setIsOwner(true);
                    } else {
                        setIsOwner(false);
                    }

                    // 2. Fetch Posts (only if profile exists)
                    const { data: postsData, error: postsError } = await supabase
                        .from('posts')
                        .select('*')
                        .eq('user_id', profileData.id)
                        .order('created_at', { ascending: false });

                    if (postsError) {
                        console.error('Error fetching posts:', postsError);
                    } else {
                        setPosts(postsData || []);
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfileAndPosts();
    }, [username, currentUser]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-amber-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-400 p-4 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">User not found</h2>
                <p className="max-w-xs mb-6">The user @{username} does not exist or has been deleted.</p>
                <Link href="/" className="text-amber-500 hover:underline">Return Home</Link>
            </div>
        );
    }

    // Fallback images
    const bannerUrl = "https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?q=80&w=1200&auto=format&fit=crop";
    const avatarUrl = profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop";

    return (
        <div className="flex bg-zinc-950 min-h-screen">
            <main className="flex-1 h-full overflow-y-auto no-scrollbar relative w-full bg-zinc-950">

                {/* Mobile Top Header (Transparent/Back) */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px] md:hidden pointer-events-none">
                    <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto cursor-pointer hover:bg-black/60 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto cursor-pointer">
                        <MoreHorizontal className="w-5 h-5" />
                    </div>
                </header>

                <div className="max-w-[700px] mx-auto w-full pb-24 md:pb-10">

                    {/* Cover Image & Header Info */}
                    <div className="relative">
                        {/* Cover Image */}
                        <div className="h-32 md:h-56 w-full relative overflow-hidden md:rounded-b-none">
                            <Image
                                src={bannerUrl}
                                alt="Cover"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
                        </div>

                        {/* Profile Info Container */}
                        <div className="px-5 md:px-8 relative -mt-12 md:-mt-16 flex flex-col items-start">
                            <div className="flex justify-between items-end w-full mb-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-zinc-950 relative">
                                        <Image
                                            src={avatarUrl}
                                            alt="Avatar"
                                            fill
                                            className="rounded-full object-cover border-2 border-zinc-800"
                                        />
                                    </div>
                                    {/* Online/Verified Indicator */}
                                    {profile.is_verified && (
                                        <div className="absolute bottom-2 right-2 bg-amber-500 text-zinc-950 rounded-full p-1 border-2 border-zinc-950" title="Verified Creator">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Actions (Hidden on Mobile) */}
                                <div className="hidden md:flex items-center gap-2 mb-2">
                                    {isOwner ? (
                                        <Link href="/settings/profile" className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-white/5 flex items-center gap-2">
                                            Edit Profile
                                        </Link>
                                    ) : (
                                        <>
                                            <button className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-white/5 flex items-center gap-2">
                                                Subscribe
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Name & Bio */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">{profile.full_name || username}</h1>
                                    {profile.is_verified && <span className="bg-amber-500/10 text-amber-500 text-[10px] font-medium px-1.5 py-0.5 rounded border border-amber-500/20">Top 1%</span>}
                                </div>
                                <p className="text-zinc-500 text-sm mb-3">@{profile.username}</p>

                                <div className="prose prose-invert max-w-none mb-4">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {profile.bio || "No bio yet."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-zinc-500 mb-6">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <a href="#" className="text-amber-500 hover:underline hover:text-amber-400 mr-4">website.com</a>
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Lagos, Nigeria</span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 border-y border-zinc-800 py-3 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">{posts.length}</span>
                                        <span className="text-xs text-zinc-500">Posts</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">--</span>
                                        <span className="text-xs text-zinc-500">Subscribers</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">--</span>
                                        <span className="text-xs text-zinc-500">Likes</span>
                                    </div>
                                </div>

                                {/* Mobile Action Buttons */}
                                <div className="flex md:hidden items-center gap-2 w-full mb-6">
                                    {isOwner ? (
                                        <Link href="/settings/profile" className="flex-1 bg-zinc-100 text-zinc-950 py-2.5 rounded-lg text-sm font-semibold text-center">
                                            Edit Profile
                                        </Link>
                                    ) : (
                                        <>
                                            <button className="flex-1 bg-zinc-100 text-zinc-950 py-2.5 rounded-lg text-sm font-semibold">Subscribe</button>
                                            <button className="flex-1 bg-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium border border-zinc-700">Message</button>
                                            <button className="p-2.5 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Subscription Tier Card (Only for creators, maybe hide if owner?) */}
                                {!isOwner && (
                                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-4 mb-6 relative overflow-hidden">
                                        <div className="flex items-start justify-between relative z-10">
                                            <div>
                                                <h3 className="text-sm font-semibold text-amber-500 mb-1">Join the Inner Circle</h3>
                                                <p className="text-xs text-zinc-400 max-w-[280px] leading-relaxed">Get access to weekly exclusive content, private chats, and more.</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-lg font-bold text-zinc-200">₦2,500</span>
                                                <span className="text-[10px] text-zinc-500 uppercase">per month</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="sticky top-14 md:top-0 bg-zinc-950/95 backdrop-blur z-20 border-b border-zinc-800 mb-4 px-4 md:px-8">
                        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                            <button className="py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500 whitespace-nowrap">
                                Posts <span className="ml-1.5 text-xs text-zinc-500 font-normal">{posts.length}</span>
                            </button>
                            <button className="py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent hover:border-zinc-800 whitespace-nowrap transition-all">
                                Media <span className="ml-1.5 text-xs text-zinc-600 font-normal">--</span>
                            </button>
                            <button className="py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent hover:border-zinc-800 whitespace-nowrap transition-all">
                                Shop <span className="ml-1.5 text-xs text-zinc-600 font-normal">--</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="px-4 md:px-8 mb-6 flex gap-2">
                        <button className="text-xs font-medium bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-full border border-zinc-700">All</button>
                        <button className="text-xs font-medium text-zinc-500 hover:bg-zinc-900 px-3 py-1.5 rounded-full border border-transparent hover:border-zinc-800 transition-colors">Free</button>
                        <button className="text-xs font-medium text-zinc-500 hover:bg-zinc-900 px-3 py-1.5 rounded-full border border-transparent hover:border-zinc-800 transition-colors">Premium</button>
                    </div>

                    {/* Feed Content */}
                    <div className="md:px-4 space-y-4">
                        {posts.length > 0 ? (
                            posts.map(post => {
                                // Logic for locks would go here (check if user is subscribed)
                                const isLocked = post.is_premium && !isOwner; // Simplified lock logic

                                return (
                                    <article key={post.id} className="border-b border-zinc-800 md:border md:rounded-2xl md:bg-zinc-900/20 md:border-zinc-800/50 overflow-hidden relative">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-9 h-9">
                                                    <Image src={avatarUrl} fill className="rounded-full object-cover" alt="Author" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-semibold text-zinc-100">{profile.full_name}</h3>
                                                        {post.is_premium && <span className="bg-zinc-800 text-zinc-400 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border border-zinc-700">Subscribers</span>}
                                                    </div>
                                                    <p className="text-[11px] text-zinc-500">{new Date(post.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {isLocked && <Lock className="w-4 h-4 text-zinc-600" />}
                                        </div>

                                        <div className="px-4 pb-3">
                                            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{post.content}</p>
                                        </div>

                                        {post.image_url && (
                                            <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                                <Image
                                                    src={post.image_url}
                                                    fill
                                                    className={`object-cover ${isLocked ? 'blur-2xl opacity-30' : ''}`}
                                                    alt="Content"
                                                />

                                                {isLocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                                                        <div className="bg-zinc-950/60 border border-white/10 p-6 rounded-2xl max-w-[280px] w-full text-center shadow-2xl backdrop-blur-xl">
                                                            <span className="text-amber-500 mx-auto mb-3 block">
                                                                <div className="w-min mx-auto">
                                                                    <Lock className="w-6 h-6" />
                                                                </div>
                                                            </span>
                                                            <h4 className="text-zinc-100 font-medium mb-1">Unlock this post</h4>
                                                            <p className="text-zinc-500 text-xs mb-4">Subscribe to see exclusive content.</p>
                                                            <button className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2 rounded-lg text-xs transition-all mb-2">
                                                                Subscribe • {formatCurrency(post.price || 2500)}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-3 border-t border-zinc-800/30 flex items-center justify-between opacity-50">
                                            <span className="text-xs text-zinc-500">Likes (--)</span>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                                    <ImageOff className="w-8 h-8" />
                                </div>
                                <h3 className="text-zinc-300 font-medium mb-2">No posts yet</h3>
                                <p className="text-zinc-500 text-sm">This user hasn't posted anything yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Links (Mobile only) */}
                    <div className="md:hidden py-6 text-center space-y-2 border-t border-zinc-900 mt-8">
                        <p className="text-zinc-700 text-[10px]">© 2024 Moyo. Made for Africa.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
