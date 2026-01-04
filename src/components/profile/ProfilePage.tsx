'use client';

import { useState } from 'react';

// Mock User Data
const USER = {
    name: "Amara Gold ✨",
    handle: "@amaragold",
    stats: { posts: "12.5k", likes: "850k", fans: "140k" },
    bio: "Fashion Model | Creative Director | Afro-Futurist 🌍\nWelcome to my exclusive world. Subscribe for BTS, unseen shoots, and direct vibes.",
    // In a real app, these would be image URLs
    coverColor: "from-purple-900 via-indigo-950 to-black",
    avatarColor: "from-gold to-orange-600"
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div className="max-w-[900px] mx-auto w-full pb-24 md:pb-10">
            {/* Cover Image */}
            <div className={`h-48 md:h-80 bg-gradient-to-r ${USER.coverColor} relative w-full`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <button className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur text-white p-2 rounded-full transition-colors">
                    <span className="iconify" data-icon="lucide:camera" data-width="20"></span>
                </button>
            </div>

            <div className="px-4 md:px-8 relative">
                {/* Profile Info Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-6">
                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-zinc-950 bg-zinc-900 relative overflow-hidden shadow-2xl shrink-0 group cursor-pointer">
                        <div className={`w-full h-full bg-gradient-to-br ${USER.avatarColor}`}></div>
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="iconify text-white" data-icon="lucide:camera" data-width="24"></span>
                        </div>
                    </div>

                    <div className="mt-3 md:mt-0 md:ml-6 flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 flex items-center justify-center md:justify-start gap-2">
                                    {USER.name}
                                    <span className="iconify text-gold" data-icon="lucide:badge-check" data-width="20"></span>
                                </h1>
                                <p className="text-foreground-muted text-base md:text-lg">{USER.handle}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2.5 rounded-full border border-surface-highlight hover:border-gold hover:text-gold text-foreground-muted transition-colors bg-surface/50">
                                    <span className="iconify" data-icon="lucide:mail" data-width="20"></span>
                                </button>
                                <button className="p-2.5 rounded-full border border-surface-highlight hover:border-gold hover:text-gold text-foreground-muted transition-colors bg-surface/50">
                                    <span className="iconify" data-icon="lucide:share-2" data-width="20"></span>
                                </button>
                                <button className="md:hidden p-2.5 rounded-full border border-surface-highlight hover:border-gold hover:text-gold text-foreground-muted transition-colors bg-surface/50">
                                    <span className="iconify" data-icon="lucide:more-horizontal" data-width="20"></span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 mt-5 md:mt-6 text-sm font-medium border-t border-zinc-900 md:border-t-0 pt-4 md:pt-0 w-full">
                            <div className="flex flex-col items-center md:items-start cursor-pointer hover:opacity-80">
                                <span className="text-white text-lg font-bold">{USER.stats.posts}</span>
                                <span className="text-foreground-muted text-xs uppercase tracking-wide">Posts</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start cursor-pointer hover:opacity-80">
                                <span className="text-white text-lg font-bold">{USER.stats.likes}</span>
                                <span className="text-foreground-muted text-xs uppercase tracking-wide">Likes</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start cursor-pointer hover:opacity-80">
                                <span className="text-white text-lg font-bold">{USER.stats.fans}</span>
                                <span className="text-foreground-muted text-xs uppercase tracking-wide">Fans</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-8 max-w-2xl mx-auto md:mx-0 text-center md:text-left">
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                        {USER.bio}
                    </p>
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-gold text-sm font-medium hover:underline cursor-pointer">
                        <span className="iconify" data-icon="lucide:link" data-width="14"></span>
                        amaragold.com
                    </div>
                </div>

                {/* Subscription Tiers */}
                <div className="grid md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-surface/50 border border-gold/30 rounded-2xl p-5 relative overflow-hidden group hover:border-gold transition-colors backdrop-blur-sm">
                        <div className="absolute top-0 right-0 bg-gold text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg tracking-wider">POPULAR</div>
                        <h3 className="text-lg font-bold text-white mb-1">Monthly Access</h3>
                        <div className="text-2xl font-bold text-gold mb-3">$9.99 <span className="text-sm text-foreground-muted font-normal">/ month</span></div>
                        <ul className="text-xs text-zinc-400 space-y-1.5 mb-5">
                            <li className="flex items-center gap-2"><span className="iconify text-gold" data-icon="lucide:check" data-width="12"></span> Full access to content feed</li>
                            <li className="flex items-center gap-2"><span className="iconify text-gold" data-icon="lucide:check" data-width="12"></span> Direct messaging</li>
                        </ul>
                        <button className="w-full bg-gold text-black font-bold py-2.5 rounded-xl text-sm hover:scale-[1.01] transition-transform active:scale-95">
                            Subscribe Now
                        </button>
                    </div>

                    <div className="bg-surface/30 border border-surface-highlight rounded-2xl p-5 group hover:border-gold/50 transition-colors backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-1">3 Months Bundle</h3>
                        <div className="text-2xl font-bold text-white mb-3">$24.99 <span className="text-sm text-foreground-muted font-normal">/ 3 mo</span></div>
                        <p className="text-green-400 text-xs mb-5 font-medium bg-green-900/20 inline-block px-2 py-0.5 rounded">Save 15%</p>
                        <button className="w-full bg-surface-highlight border border-zinc-700 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-gold hover:text-black hover:border-gold transition-all">
                            Get Bundle
                        </button>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="border-b border-surface-highlight mb-6 sticky top-14 md:top-0 bg-zinc-950/95 backdrop-blur z-20 -mx-4 md:mx-0 px-4 md:px-0">
                    <div className="flex justify-between md:justify-start md:gap-12 overflow-x-auto no-scrollbar">
                        {['posts', 'photos', 'videos', 'locked'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 border-b-2 capitalize transition-colors text-sm font-medium whitespace-nowrap px-2 md:px-0 ${activeTab === tab
                                    ? 'border-gold text-gold'
                                    : 'border-transparent text-foreground-muted hover:text-white'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="iconify"
                                        data-icon={tab === 'posts' ? 'lucide:grid' : tab === 'photos' ? 'lucide:image' : tab === 'videos' ? 'lucide:play-circle' : 'lucide:lock'}
                                        data-width="16">
                                    </span>
                                    {tab}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-3 gap-1 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className={`aspect-square bg-surface relative group cursor-pointer overflow-hidden ${i === 0 ? 'rounded-tl-lg' : ''} ${i === 2 ? 'rounded-tr-lg' : ''}`}>
                            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-700">
                                {/* Mock Content */}
                                {activeTab === 'videos' ? (
                                    <span className="iconify" data-icon="lucide:play" data-width="32"></span>
                                ) : (
                                    <span className="iconify" data-icon="lucide:image" data-width="32"></span>
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                                <div className="flex items-center gap-1">
                                    <span className="iconify" data-icon="lucide:heart" data-width="18" data-fill="currentColor"></span>
                                    <span className="text-sm font-bold">1.2k</span>
                                </div>
                            </div>

                            {/* Premium Indicator */}
                            {i % 3 === 0 && (
                                <div className="absolute top-2 right-2 bg-gold text-black p-1 rounded-full">
                                    <span className="iconify" data-icon="lucide:star" data-width="10" data-fill="currentColor"></span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
