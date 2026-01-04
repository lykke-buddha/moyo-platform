'use client';

import { useState } from 'react';
import { EXPLORE_POSTS, POSTS } from '@/lib/mockData';
import { Search, Heart, Play, Layers, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState('For You');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        "For You", "Fashion", "Music", "Beauty", "Tech", "Art", "Dance", "Lifestyle", "Comedy"
    ];

    // Filter Posts based on search
    const filteredPosts = EXPLORE_POSTS.filter(post => {
        if (!searchQuery) return true;
        // Simple mock search: filter by randomly satisfying match or if type matches
        return post.type.includes(searchQuery.toLowerCase()) || Math.random() > 0.5; // Dummy search logic for visuals
    });

    // Mock User Search (using unique authors from POSTS)
    const uniqueAuthors = Array.from(new Map(POSTS.map(post => [post.author.handle, post.author])).values());
    const filteredUsers = uniqueAuthors.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pb-24 md:pb-10 min-h-screen">
            {/* Search Header */}
            <header className="sticky top-0 z-30 glass border-b border-zinc-800/50 px-4 py-3 bg-zinc-950/90 backdrop-blur">
                <div className="max-w-[640px] mx-auto w-full">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-500 transition-colors">
                            <Search className="w-4.5 h-4.5" strokeWidth={2} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search creators, posts, or tags..."
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-[640px] mx-auto w-full px-4 pt-4">
                {/* Categories - Hide when searching */}
                {!searchQuery && (
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar mb-6 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeCategory === category
                                    ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg shadow-amber-500/10'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Results: Creators */}
                {searchQuery && filteredUsers.length > 0 && (
                    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2">
                        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Creators</h2>
                        <div className="space-y-3">
                            {filteredUsers.map(user => (
                                <Link key={user.handle} href={`/profile/${user.handle.replace('@', '')}`} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-white font-medium text-sm">{user.name}</p>
                                            {user.isVerified && <div className="bg-amber-500 rounded-full p-[2px]"><div className="text-black"><CheckCircle2Icon size={8} /></div></div>}
                                        </div>
                                        <p className="text-zinc-500 text-xs">{user.handle}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Section (Hide when searching) */}
                {!searchQuery && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-zinc-100 font-semibold text-lg">Trending Now 🔥</h2>
                            <button className="text-xs text-amber-500 hover:underline">See all</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="aspect-[4/5] bg-zinc-900 rounded-2xl relative overflow-hidden group cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1545657756-3218cd4d5324?w=600&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Trending 1" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                    <p className="text-white text-sm font-semibold truncate">Afro-Beats Festival</p>
                                    <p className="text-zinc-400 text-xs">2.4m views</p>
                                </div>
                            </div>
                            <div className="aspect-[4/5] bg-zinc-900 rounded-2xl relative overflow-hidden group cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Trending 2" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                    <p className="text-white text-sm font-semibold truncate">Lagos Fashion Week</p>
                                    <p className="text-zinc-400 text-xs">1.8m views</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Explore Grid */}
                <div>
                    {!searchQuery && <h2 className="text-zinc-100 font-semibold text-lg mb-4">Discover</h2>}
                    {searchQuery && filteredPosts.length > 0 && <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Posts</h2>}

                    <div className="grid grid-cols-3 gap-1 md:gap-2">
                        {(searchQuery ? filteredPosts : EXPLORE_POSTS).map((post, i) => (
                            <div key={post.id} className={`relative group cursor-pointer overflow-hidden bg-zinc-900 ${i % 3 === 0 && !searchQuery ? 'row-span-2 aspect-[1/2]' : 'aspect-square'} rounded-lg md:rounded-xl`}>
                                <img src={post.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Explore" />

                                {/* Type Icon */}
                                <div className="absolute top-2 right-2 bg-black/40 backdrop-blur rounded p-1 text-white">
                                    {post.type === 'video' ? <Play className="w-3 h-3" /> : post.type === 'collection' ? <Layers className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                </div>

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 md:gap-4">
                                    <div className="flex items-center gap-1 text-white">
                                        <Heart className="w-4 h-4" fill="currentColor" />
                                        <span className="text-xs font-bold">{post.likes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {searchQuery && filteredUsers.length === 0 && filteredPosts.length === 0 && (
                        <div className="py-20 text-center text-zinc-500">
                            <p>No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                {!searchQuery && (
                    <div className="py-8 flex justify-center">
                        <Loader2Icon className="w-6 h-6 animate-spin text-amber-500" />
                    </div>
                )}
            </div>
        </div>
    );
}

// Minimal CheckCircle Icon helper since the main one is used in map
function CheckCircle2Icon({ size = 10 }: { size?: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
}

function Loader2Icon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
}
