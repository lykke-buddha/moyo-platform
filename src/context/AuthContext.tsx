'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { MockService } from '@/services/mockService';

type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password?: string, rememberMe?: boolean) => Promise<void>;
    signup: (email: string, password?: string, username?: string, role?: UserRole, dob?: { day: number, month: number, year: number }, countryData?: { name: string, code: string, flag: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    updateProfile: async () => { },
    isLoginModalOpen: false,
    openLoginModal: () => { },
    closeLoginModal: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    useEffect(() => {
        // Check active session on mount
        const initAuth = async () => {
            try {
                const sessionUser = await MockService.checkSession();
                setUser(sessionUser);
            } catch (error) {
                console.error("Session check failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password?: string, rememberMe: boolean = false) => {
        if (!password) throw new Error("Password is required for login");
        const response = await MockService.login(email, password, rememberMe);
        setUser(response.user);
    };

    const signup = async (email: string, password?: string, username?: string, role: UserRole = 'fan', dob?: { day: number, month: number, year: number }, countryData?: { name: string, code: string, flag: string }) => {
        if (!password || !username) throw new Error("Missing required signup fields");
        if (!dob) throw new Error("Date of birth is required");
        const response = await MockService.signup(email, password, username, role, dob, countryData);
        setUser(response.user);
    }

    const logout = async () => {
        await MockService.logout();
        setUser(null);
    };

    const updateProfile = async (updates: Partial<User>) => {
        const updatedUser = await MockService.updateProfile(updates);
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            login,
            signup,
            logout,
            updateProfile,
            isLoading,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal
        }}>
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
