'use client';


import Link from 'next/link';
import { Search, Loader } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RightSidebar() {
    const { user, isLoggedIn, isLoading } = useAuth();

    return (
        <aside className="hidden lg:flex w-80 flex-col border-l border-surface-highlight/50 bg-zinc-950 px-6 py-6 h-screen sticky top-0 overflow-y-auto no-scrollbar">
            {/* Search */}
            <div className="relative mb-8 group">
                <span className="absolute left-3 top-2.5 text-foreground-muted group-focus-within:text-gold transition-colors">
                    <Search className="w-4 h-4" />
                </span>
                <input type="text" placeholder="Search creators, posts..." className="w-full bg-surface-highlight/50 border border-transparent text-zinc-300 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-zinc-600" />
            </div>

            {/* Trending Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Trending</h3>
                    <Link href="/explore" className="text-[10px] text-gold hover:underline">View all</Link>
                </div>

                <div className="space-y-5">
                    {[
                        { name: 'Nia Art', desc: 'Digital Artist • Kenya', initials: 'NA' },
                        { name: 'Chef Jollof', desc: 'Food • Nigeria', initials: 'CJ' },
                        { name: 'AfroBeats', desc: 'Music • Ghana', initials: 'AB' },
                    ].map((creator) => (
                        <div key={creator.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-surface-highlight flex items-center justify-center text-xs font-bold text-foreground-muted border border-zinc-700">
                                    {creator.initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-gold transition-colors cursor-pointer">{creator.name}</span>
                                    <span className="text-[10px] text-zinc-500">{creator.desc}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => alert(`Followed ${creator.name}`)}
                                className="text-xs font-medium bg-surface hover:bg-surface-highlight text-zinc-300 px-3 py-1.5 rounded-lg border border-surface-highlight transition-colors"
                            >
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Promo Card or Profile Card */}
            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader className="w-6 h-6 animate-spin text-zinc-600" />
                </div>
            ) : isLoggedIn ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate w-40">My Profile</span>
                            <span className="text-xs text-zinc-500 truncate w-40">{user?.email}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-zinc-950/50 rounded-xl p-3 text-center border border-zinc-800/50">
                            <span className="block text-lg font-bold text-white">0</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Following</span>
                        </div>
                        <div className="bg-zinc-950/50 rounded-xl p-3 text-center border border-zinc-800/50">
                            <span className="block text-lg font-bold text-white">0</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Followers</span>
                        </div>
                    </div>
                    <Link
                        href="/settings"
                        className="block text-center w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-2.5 rounded-lg transition-all"
                    >
                        Edit Profile
                    </Link>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-surface-highlight via-zinc-900 to-black border border-surface-highlight/50 rounded-2xl p-5 mb-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-gold/20 transition-colors duration-500"></div>
                    <h4 className="text-sm font-semibold text-zinc-100 mb-1.5 relative z-10">Become a Creator</h4>
                    <p className="text-xs text-zinc-400 mb-4 relative z-10 leading-relaxed">Join 10,000+ African creators earning monthly income.</p>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] bg-surface-highlight border border-zinc-700 px-2 py-0.5 rounded text-foreground-muted">MPESA</span>
                        <span className="text-[10px] bg-surface-highlight border border-zinc-700 px-2 py-0.5 rounded text-foreground-muted">Paystack</span>
                    </div>

                    <Link
                        href="/earn"
                        className="block text-center w-full bg-zinc-100 text-zinc-950 text-xs font-bold py-2.5 rounded-lg hover:bg-white transition-all shadow-lg shadow-white/5"
                    >
                        Start Earning
                    </Link>
                </div>
            )}

            {/* Footer */}
            <div className="mt-auto border-t border-surface-highlight pt-6">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
                    <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-zinc-400 transition-colors">Cookies</a>
                    <a href="#" className="hover:text-zinc-400 transition-colors">Business</a>
                    <span>© 2024 Moyo</span>
                </div>
            </div>
        </aside>
    );
}
