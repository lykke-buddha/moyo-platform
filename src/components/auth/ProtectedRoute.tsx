'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoggedIn, isLoading, openLoginModal } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            openLoginModal();
            // Optional: Redirect to home if on a protected page
            // router.push('/'); 
        }
    }, [isLoading, isLoggedIn, openLoginModal, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-500">
                    <span className="iconify" data-icon="lucide:lock" data-width="32"></span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
                <p className="text-zinc-500 mb-6 max-w-sm">Please sign in to access this content.</p>
                <button
                    onClick={openLoginModal}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Sign In
                </button>
            </div>
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-500">
                    <span className="iconify" data-icon="lucide:shield-alert" data-width="32"></span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-zinc-500 mb-6 max-w-sm">You do not have permission to view this page.</p>
                <button
                    onClick={() => router.push('/')}
                    className="text-amber-500 hover:underline"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
