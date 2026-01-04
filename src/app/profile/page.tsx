'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProfileRedirectPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isLoggedIn && user) {
                // Try to get username from user object directly
                const username = user.username || user.email.split('@')[0] || 'user';
                router.replace(`/profile/${username}`);
            } else {
                // If not logged in, redirect home or open login (but home is safer)
                router.replace('/');
            }
        }
    }, [user, isLoggedIn, isLoading, router]);

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-950">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
    );
}
