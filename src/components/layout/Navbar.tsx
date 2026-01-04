'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Navbar() {
    const { isLoggedIn, user, logout, openLoginModal } = useAuth();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    <span className="text-white">MO</span>
                    <span className="text-amber-500">YO</span>
                </Link>

                {/* Desktop Nav - placeholder for now, maybe Search later */}
                <div className="hidden md:flex items-center space-x-6">
                    <div className="relative group">
                        <span className="absolute left-3 top-2 text-zinc-500 iconify group-focus-within:text-amber-500 transition-colors" data-icon="lucide:search" data-width="18"></span>
                        <input
                            type="text"
                            placeholder="Search creators..."
                            className="bg-zinc-900/50 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all w-64 placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn && user ? (

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-semibold text-white">{user.displayName || user.email.split('@')[0]}</span>
                                <span className="text-xs text-zinc-500">@{user.username || 'user'}</span>
                            </div>
                            <button onClick={logout} className="text-xs text-zinc-400 hover:text-white transition-colors">
                                Logout
                            </button>
                            <Link href="/profile">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt="Profile" width={36} height={36} className="rounded-full border border-white/20 hover:border-amber-500 transition-colors object-cover" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/20 hover:border-amber-500 transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold text-amber-500">{user.email[0].toUpperCase()}</span>
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={openLoginModal}
                                className="text-sm font-medium text-white/80 hover:text-amber-500 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={openLoginModal}
                                className="bg-amber-500 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                            >
                                Join Now
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}
