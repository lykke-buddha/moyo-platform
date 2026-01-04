'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    signup: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password?: string) => {
        if (password) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        }
    };

    const signup = async (email: string, password?: string) => {
        if (password) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
        } else {
            // Fallback to OTP if no password provided (unlikely in this UI)
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
        }
    }

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('moyo_user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
