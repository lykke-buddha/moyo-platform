'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, Compass, Plus, MessageCircle, User, LogIn } from 'lucide-react';

export default function MobileNavigation() {
    const pathname = usePathname();
    const { isLoggedIn, openLoginModal } = useAuth();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around z-50 md:hidden pb-1">
            <Link
                href="/"
                className={`${isActive('/') ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'} flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors`}
            >
                <Home className="w-[22px] h-[22px]" strokeWidth={isActive('/') ? 2 : 1.5} />
                <span className="text-[10px] font-medium">Home</span>
            </Link>

            <Link
                href="/explore"
                className={`${isActive('/explore') ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'} flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors`}
            >
                <Compass className="w-[22px] h-[22px]" strokeWidth={isActive('/explore') ? 2 : 1.5} />
                <span className="text-[10px] font-medium">Explore</span>
            </Link>

            {isLoggedIn && (
                <div className="relative -top-5">
                    <Link
                        href="/create"
                        className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/40 border-4 border-zinc-950 active:scale-95 transition-transform"
                    >
                        <Plus className="w-6 h-6" strokeWidth={2} />
                    </Link>
                </div>
            )}

            {isLoggedIn && (
                <Link
                    href="/messages"
                    className={`${isActive('/messages') ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'} flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors`}
                >
                    <MessageCircle className="w-[22px] h-[22px]" strokeWidth={isActive('/messages') ? 2 : 1.5} />
                    <span className="text-[10px] font-medium">Chat</span>
                </Link>
            )}

            {isLoggedIn ? (
                <Link
                    href="/profile"
                    className={`${pathname.startsWith('/profile') ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'} flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors`}
                >
                    <User className="w-[22px] h-[22px]" strokeWidth={pathname.startsWith('/profile') ? 2 : 1.5} />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            ) : (
                <button
                    onClick={openLoginModal}
                    className="text-zinc-500 hover:text-zinc-300 flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors"
                >
                    <LogIn className="w-[22px] h-[22px]" strokeWidth={1.5} />
                    <span className="text-[10px] font-medium">Login</span>
                </button>
            )}
        </div>
    );
}
