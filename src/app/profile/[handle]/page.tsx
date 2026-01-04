'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import { POSTS, STORIES, CURRENT_USER } from '@/lib/mockData'; // Import mock data

export default function ProfilePage() {
    const router = useRouter();
    // In Next.js App Router, params are passed as props to the page component, 
    // but relying on useParams hook is often easier for CLIENT components.
    const params = useParams();
    const handle = typeof params?.handle === 'string' ? params.handle : 'zainab'; // Default/Fallback

    // Mock finding the user. In a real app we'd fetch from API. 
    // We try to find match in POSTS or STORIES for now since we don't have a centralized Users array.
    const userFromPosts = POSTS.find(p => p.author.handle.replace('@', '') === handle)?.author;
    const userFromStories = STORIES.find(s => (s.handle || s.name.toLowerCase()) === handle);

    // Construct a user object
    const profileUser = userFromPosts ? {
        name: userFromPosts.name,
        handle: userFromPosts.handle,
        avatar: userFromPosts.avatar,
        isVerified: userFromPosts.isVerified,
        bio: userFromPosts.isVerified ? "Exclusive content creator. ✨ Join my VIP club for daily updates." : "Fashion designer & lifestyle blogger. 🇳🇬",
        banner: "https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?q=80&w=1200&auto=format&fit=crop"
    } : userFromStories ? {
        name: userFromStories.name,
        handle: `@${userFromStories.handle || userFromStories.name.toLowerCase()}`,
        avatar: userFromStories.avatar,
        isVerified: false,
        bio: "Welcome to my world. 🌍",
        banner: "https://images.unsplash.com/photo-1519751138087-5bf79df62d58?w=1200&h=400&fit=crop"
    } : {
        // Fallback for "Zainab" or unknown
        name: 'Zainab Fashion',
        handle: '@zainab_style',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        isVerified: true,
        bio: "🇳🇬 Contemporary Afro-fusion designer. Bringing Lagos street style to the world. \n✨ Exclusive tutorials, pattern downloads, and BTS content for subscribers.",
        banner: "https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?q=80&w=1200&auto=format&fit=crop"
    };

    // Filter posts for this user (simulated) or just show some random ones for demo if none match
    const userPosts = POSTS.filter(p => p.author.handle === profileUser.handle);
    // If no posts found (e.g. story user), maybe show generic placeholder content or empty state.
    // For demo, if 0 posts, we might want to show the generic "Zainab" posts if the handle is zainab, or nothing.
    const displayPosts = userPosts.length > 0 ? userPosts : (handle === 'zainab' ? [] : []);
    // Actually, let's just use the hardcoded structure if it's Zainab, otherwise map.

    // State for locks
    const [unlockedPosts, setUnlockedPosts] = useState<Record<string, boolean>>({});

    const handleUnlock = (postId: string) => {
        if (confirm("Unlock this post for ₦500?")) {
            setUnlockedPosts(prev => ({ ...prev, [postId]: true }));
        }
    };

    return (
        <div className="flex bg-zinc-950 min-h-screen">
            <main className="flex-1 h-full overflow-y-auto no-scrollbar relative w-full bg-zinc-950">

                {/* Mobile Top Header (Transparent/Back) */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px] md:hidden pointer-events-none">
                    <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto cursor-pointer hover:bg-black/60 transition-colors">
                        <span className="iconify" data-icon="lucide:arrow-left" data-width="20" data-stroke-width="1.5"></span>
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto cursor-pointer">
                        <span className="iconify" data-icon="lucide:more-horizontal" data-width="20" data-stroke-width="1.5"></span>
                    </div>
                </header>

                <div className="max-w-[700px] mx-auto w-full pb-24 md:pb-10">

                    {/* Cover Image & Header Info */}
                    <div className="relative">
                        {/* Cover Image */}
                        <div className="h-32 md:h-56 w-full relative overflow-hidden md:rounded-b-none">
                            <img src={profileUser.banner} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
                        </div>

                        {/* Profile Info Container */}
                        <div className="px-5 md:px-8 relative -mt-12 md:-mt-16 flex flex-col items-start">
                            <div className="flex justify-between items-end w-full mb-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-zinc-950">
                                        <img src={profileUser.avatar} className="w-full h-full rounded-full object-cover border-2 border-zinc-800" alt="Avatar" />
                                    </div>
                                    {/* Online/Verified Indicator */}
                                    {profileUser.isVerified && (
                                        <div className="absolute bottom-2 right-2 bg-amber-500 text-zinc-950 rounded-full p-1 border-2 border-zinc-950" title="Verified Creator">
                                            <span className="iconify" data-icon="lucide:check" data-width="12" data-stroke-width="3"></span>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Actions (Hidden on Mobile) */}
                                <div className="hidden md:flex items-center gap-2 mb-2">
                                    <button className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                                        <span className="iconify" data-icon="lucide:mail" data-width="18" data-stroke-width="1.5"></span>
                                    </button>
                                    <button className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                                        <span className="iconify" data-icon="lucide:share-2" data-width="18" data-stroke-width="1.5"></span>
                                    </button>
                                    <button className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-white/5 flex items-center gap-2">
                                        Subscribe
                                    </button>
                                </div>
                            </div>

                            {/* Name & Bio */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">{profileUser.name}</h1>
                                    {profileUser.isVerified && <span className="bg-amber-500/10 text-amber-500 text-[10px] font-medium px-1.5 py-0.5 rounded border border-amber-500/20">Top 1%</span>}
                                </div>
                                <p className="text-zinc-500 text-sm mb-3">{profileUser.handle}</p>

                                <div className="prose prose-invert max-w-none mb-4">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {profileUser.bio}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-zinc-500 mb-6">
                                    <span className="iconify" data-icon="lucide:link" data-width="14"></span>
                                    <a href="#" className="text-amber-500 hover:underline hover:text-amber-400 mr-4">website.com</a>
                                    <span className="iconify" data-icon="lucide:map-pin" data-width="14"></span>
                                    <span>Lagos, Nigeria</span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 border-y border-zinc-800 py-3 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">{displayPosts.length || 142}</span>
                                        <span className="text-xs text-zinc-500">Posts</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">12.4k</span>
                                        <span className="text-xs text-zinc-500">Subscribers</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">89.2k</span>
                                        <span className="text-xs text-zinc-500">Likes</span>
                                    </div>
                                </div>

                                {/* Mobile Action Buttons */}
                                <div className="flex md:hidden items-center gap-2 w-full mb-6">
                                    <button className="flex-1 bg-zinc-100 text-zinc-950 py-2.5 rounded-lg text-sm font-semibold">Subscribe</button>
                                    <button className="flex-1 bg-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium border border-zinc-700">Message</button>
                                    <button className="p-2.5 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                                        <span className="iconify" data-icon="lucide:more-horizontal" data-width="20"></span>
                                    </button>
                                </div>

                                {/* Subscription Tier Card */}
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
                            </div>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <div className="sticky top-14 md:top-0 bg-zinc-950/95 backdrop-blur z-20 border-b border-zinc-800 mb-4 px-4 md:px-8">
                        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                            <button className="py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500 whitespace-nowrap">
                                Posts <span className="ml-1.5 text-xs text-zinc-500 font-normal">{displayPosts.length || 142}</span>
                            </button>
                            <button className="py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent hover:border-zinc-800 whitespace-nowrap transition-all">
                                Media <span className="ml-1.5 text-xs text-zinc-600 font-normal">84</span>
                            </button>
                            <button className="py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent hover:border-zinc-800 whitespace-nowrap transition-all">
                                Shop <span className="ml-1.5 text-xs text-zinc-600 font-normal">4</span>
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

                        {/* Render user posts if any, otherwise render the placeholder posts from previous step but adapting to user if possible? 
                            For now, let's map userPosts. If empty, we show a default set for "Zainab" as fallback.
                        */}
                        {displayPosts.length > 0 ? (
                            displayPosts.map(post => {
                                const isUnlocked = unlockedPosts[post.id];
                                const isLocked = post.meta.isPremium && !isUnlocked;

                                return (
                                    <article key={post.id} className="border-b border-zinc-800 md:border md:rounded-2xl md:bg-zinc-900/20 md:border-zinc-800/50 overflow-hidden relative">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={post.author.avatar} className="w-9 h-9 rounded-full object-cover" alt="Author" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-semibold text-zinc-100">{post.author.name}</h3>
                                                        {post.meta.isPremium && <span className="bg-zinc-800 text-zinc-400 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border border-zinc-700">Subscribers</span>}
                                                    </div>
                                                    <p className="text-[11px] text-zinc-500">{post.meta.time}</p>
                                                </div>
                                            </div>
                                            {isLocked && <span className="iconify text-zinc-600" data-icon="lucide:lock" data-width="18"></span>}
                                        </div>

                                        <div className="px-4 pb-3">
                                            <p className="text-sm text-zinc-300">{post.content.text}</p>
                                        </div>

                                        {post.content.image && (
                                            <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                                <img src={post.content.image} className={`w-full h-full object-cover ${isLocked ? 'blur-2xl opacity-30' : ''}`} alt="Content" />

                                                {isLocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                                                        <div className="bg-zinc-950/60 border border-white/10 p-6 rounded-2xl max-w-[280px] w-full text-center shadow-2xl backdrop-blur-xl">
                                                            <span className="text-amber-500 mx-auto mb-3 block">
                                                                <div className="w-min mx-auto">
                                                                    <span className="iconify" data-icon="lucide:lock" data-width="24" data-stroke-width="2"></span>
                                                                </div>
                                                            </span>
                                                            <h4 className="text-zinc-100 font-medium mb-1">Unlock this post</h4>
                                                            <p className="text-zinc-500 text-xs mb-4">Subscribe to see exclusive content.</p>
                                                            <button className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2 rounded-lg text-xs transition-all mb-2">
                                                                Subscribe • {post.lock?.price || '₦2,500'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUnlock(post.id)}
                                                                className="w-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 py-2 rounded-lg text-xs"
                                                            >
                                                                Unlock • {post.lock?.oneTimePrice || '₦500'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-3 border-t border-zinc-800/30 flex items-center justify-between opacity-50">
                                            <span className="text-xs text-zinc-500">{post.stats.likes} Likes</span>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            /* Fallback content for when we don't have simulated posts for this user */
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                                    <span className="iconify" data-icon="lucide:image-off" data-width="32"></span>
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
