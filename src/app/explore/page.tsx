'use client';

import { useState } from 'react';
import { EXPLORE_POSTS } from '@/lib/mockData';

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState('For You');

    const categories = [
        "For You", "Fashion", "Music", "Beauty", "Tech", "Art", "Dance", "Lifestyle", "Comedy"
    ];

    return (
        <div className="pb-24 md:pb-10 min-h-screen">
            {/* Search Header */}
            <header className="sticky top-0 z-30 glass border-b border-zinc-800/50 px-4 py-3 bg-zinc-950/90 backdrop-blur">
                <div className="max-w-[640px] mx-auto w-full">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-500 transition-colors">
                            <span className="iconify" data-icon="lucide:search" data-width="18" data-stroke-width="2"></span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search creators, posts, or tags..."
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-[640px] mx-auto w-full px-4 pt-4">
                {/* Categories */}
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

                {/* Trending Section */}
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

                {/* Explore Grid */}
                <div>
                    <h2 className="text-zinc-100 font-semibold text-lg mb-4">Discover</h2>
                    <div className="grid grid-cols-3 gap-1 md:gap-2">
                        {EXPLORE_POSTS.map((post, i) => (
                            <div key={post.id} className={`relative group cursor-pointer overflow-hidden bg-zinc-900 ${i % 3 === 0 ? 'row-span-2 aspect-[1/2]' : 'aspect-square'} rounded-lg md:rounded-xl`}>
                                <img src={post.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Explore" />

                                {/* Type Icon */}
                                <div className="absolute top-2 right-2 bg-black/40 backdrop-blur rounded p-1 text-white">
                                    <span className="iconify" data-icon={post.type === 'video' ? 'lucide:play' : post.type === 'collection' ? 'lucide:layers' : 'lucide:image'} data-width="12"></span>
                                </div>

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 md:gap-4">
                                    <div className="flex items-center gap-1 text-white">
                                        <span className="iconify" data-icon="lucide:heart" data-width="16" data-fill="currentColor"></span>
                                        <span className="text-xs font-bold">{post.likes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                <div className="py-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-zinc-800 border-t-amber-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
}
