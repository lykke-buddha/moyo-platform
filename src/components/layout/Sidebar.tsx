'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Home,
    Compass,
    Bell,
    MessageCircle,
    CreditCard,
    Settings2,
    HeartHandshake,
    LogOut,
    LogIn,
    Loader
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const { isLoggedIn, logout, openLoginModal, user, isLoading } = useAuth();

    // Debug Auth State
    console.log('Sidebar Auth State:', { isLoggedIn, email: user?.email });

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Compass, label: 'Explore', path: '/explore' },
        // Only show protected routes if logged in
        ...(isLoggedIn ? [
            { icon: Bell, label: 'Notifications', path: '/notifications', badge: true },
            { icon: MessageCircle, label: 'Messages', path: '/messages' },
            { icon: CreditCard, label: 'Payouts', path: '/payouts' },
            { icon: Settings2, label: 'Settings', path: '/settings' },
        ] : []),
    ];

    return (
        <aside className="hidden md:flex w-[88px] lg:w-64 flex-col border-r border-zinc-800/50 bg-zinc-950/50 pt-6 h-screen sticky top-0 transition-all duration-300">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 px-4 lg:px-6">
                <div className="w-8 h-8 min-w-[32px] rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-inner shadow-white/10">
                    <HeartHandshake className="w-[18px] h-[18px]" strokeWidth={2} />
                </div>
                <h1 className="hidden lg:block text-lg font-semibold tracking-tight text-zinc-100">MOYO</h1>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1 px-3">
                {navItems.map((item) => {
                    const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 lg:px-3 py-2.5 rounded-lg text-sm group justify-center lg:justify-start transition-all ${isActive
                                ? 'bg-zinc-800/60 text-amber-500 font-medium'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-500' : 'group-hover:text-zinc-300'}`} strokeWidth={isActive ? 2 : 1.5} />
                            <span className="hidden lg:block">{item.label}</span>
                            {item.badge && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 hidden lg:block"></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-zinc-800/50 space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full py-2.5">
                        <Loader className="w-5 h-5 animate-spin text-zinc-600" />
                    </div>
                ) : isLoggedIn ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                            <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold text-xs">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="hidden lg:flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-zinc-200 truncate w-32">{user?.email?.split('@')[0]}</span>
                                <span className="text-[10px] text-zinc-500 truncate w-32">{user?.email}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-800/40 transition-all w-full justify-center lg:justify-start"
                        >
                            <LogOut className="w-5 h-5" strokeWidth={1.5} />
                            <span className="hidden lg:block">Logout</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={openLoginModal}
                        className="flex items-center width-full gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-amber-500 hover:bg-zinc-800/40 transition-all w-full justify-center lg:justify-start"
                    >
                        <LogIn className="w-5 h-5" strokeWidth={1.5} />
                        <span className="hidden lg:block">Login</span>
                    </button>
                )}

                <button onClick={() => alert('Help & Support center is under construction.')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all w-full justify-center lg:justify-start">
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                        <span className="text-[10px] font-bold">?</span>
                    </div>
                    <span className="hidden lg:block">Help & Support</span>
                </button>
            </div>
        </aside>
    );
}
