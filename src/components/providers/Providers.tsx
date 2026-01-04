'use client';

import { AuthProvider } from '@/context/AuthContext';
import GlobalAuthModal from '@/components/auth/GlobalAuthModal';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <GlobalAuthModal />
            {children}
        </AuthProvider>
    );
}
