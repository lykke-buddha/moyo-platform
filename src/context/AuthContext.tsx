'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { db } from '@/lib/db';
import { User, UserRole } from '@/types';
import { MockService } from '@/services/mockService';

type AuthContextType = {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    session: Session | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password?: string, rememberMe?: boolean) => Promise<void>;
    signup: (email: string, password?: string, username?: string, role?: UserRole, dob?: { day: number, month: number, year: number }, countryData?: { name: string, code: string, flag: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    refreshUser: () => Promise<void>;
    subscribedCreatorIds: string[];
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    supabaseUser: null,
    session: null,
    isLoggedIn: false,
    isLoading: true,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    updateProfile: async () => { },
    isLoginModalOpen: false,
    openLoginModal: () => { },
    closeLoginModal: () => { },
    refreshUser: async () => { },
    subscribedCreatorIds: [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [subscribedCreatorIds, setSubscribedCreatorIds] = useState<string[]>([]);
    const [useMock, setUseMock] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    // Fetch user profile from our users table
    const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
        try {
            const profile = await db.users.getById(userId);
            if (profile) {
                // Transform DB format to our User type
                return {
                    id: profile.id,
                    email: profile.email,
                    username: profile.username,
                    displayName: profile.display_name || profile.username,
                    role: profile.role as UserRole,
                    accountType: profile.role as 'creator' | 'fan',
                    age: profile.age || 0,
                    dateOfBirth: profile.date_of_birth ? {
                        day: new Date(profile.date_of_birth).getDate(),
                        month: new Date(profile.date_of_birth).getMonth() + 1,
                        year: new Date(profile.date_of_birth).getFullYear()
                    } : { day: 1, month: 1, year: 2000 },
                    ageVerified: profile.age_verified || false,
                    country: profile.country || '',
                    countryCode: profile.country_code || '',
                    countryFlag: profile.country_flag || '',
                    category: profile.category || '',
                    bio: profile.bio || '',
                    avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
                    coverImage: profile.cover_image || '',
                    banner: profile.cover_image || '',
                    followersCount: profile.followers_count || 0,
                    followers: [],
                    following: [],
                    subscribedTo: [],
                    isVerified: profile.is_verified || false,
                    verificationStatus: (profile.verification_status as 'pending' | 'verified' | 'failed' | 'resubmit') || 'pending',
                    subscribersCount: profile.subscribers_count || 0,
                    subscriptionPrice: profile.subscription_price || 0,
                    totalPosts: profile.total_posts || 0,
                    totalLikes: profile.total_likes || 0,
                    totalViews: profile.total_views || 0,
                    totalEarnings: profile.total_earnings || 0,
                    engagementRate: profile.engagement_rate || 0,
                    contentRating: (profile.content_rating as 'sfw' | 'nsfw') || 'sfw',
                    allowExplicitContent: profile.allow_explicit_content || false,
                    messagingEnabled: profile.messaging_enabled || true,
                    messagingPrice: profile.messaging_price || 0,
                    autoAcceptMessages: profile.auto_accept_messages || true,
                    isOnline: profile.is_online || false,
                    lastSeen: profile.last_seen ? new Date(profile.last_seen).getTime() : Date.now(),
                    createdAt: profile.created_at ? new Date(profile.created_at).getTime() : Date.now(),
                    creatorSince: profile.creator_since ? new Date(profile.creator_since).getTime() : undefined,
                    isLoggedIn: true,
                } as User;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }, []);

    // Load subscribed creator IDs
    const loadSubscriptions = useCallback(async (userId: string) => {
        try {
            const ids = await db.subscriptions.getSubscribedCreatorIds(userId);
            setSubscribedCreatorIds(ids);
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        }
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        if (useMock && user) {
            // MockService mode - reload from mock
            try {
                const sessionUser = await MockService.checkSession();
                setUser(sessionUser);
            } catch { /* ignore */ }
            return;
        }

        if (supabaseUser) {
            const profile = await fetchUserProfile(supabaseUser.id);
            if (profile) {
                setUser(profile);
                await loadSubscriptions(supabaseUser.id);
            }
        }
    }, [supabaseUser, fetchUserProfile, loadSubscriptions, useMock, user]);

    // Initialize auth
    useEffect(() => {
        const initAuth = async () => {
            // Check if Supabase is configured
            if (!isSupabaseConfigured()) {
                console.log('Supabase not configured, using MockService');
                setUseMock(true);

                // Fall back to MockService
                try {
                    const sessionUser = await MockService.checkSession();
                    setUser(sessionUser);
                } catch {
                    // No session
                }
                setIsLoading(false);
                return;
            }

            try {
                // Get existing session
                const { data: { session: existingSession } } = await supabase.auth.getSession();
                setSession(existingSession);

                if (existingSession?.user) {
                    setSupabaseUser(existingSession.user);
                    const profile = await fetchUserProfile(existingSession.user.id);
                    setUser(profile);
                    if (profile) {
                        await loadSubscriptions(existingSession.user.id);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes (only if Supabase configured)
        if (isSupabaseConfigured()) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
                console.log('Auth state change:', event);
                setSession(newSession);

                if (newSession?.user) {
                    setSupabaseUser(newSession.user);
                    const profile = await fetchUserProfile(newSession.user.id);
                    setUser(profile);

                    if (profile) {
                        await loadSubscriptions(newSession.user.id);
                    }

                    // Update last login on sign in
                    if (event === 'SIGNED_IN') {
                        await db.users.update(newSession.user.id, {
                            last_login_at: new Date().toISOString(),
                            is_online: true
                        });
                    }
                } else {
                    setSupabaseUser(null);
                    setUser(null);
                    setSubscribedCreatorIds([]);
                }
            });

            return () => subscription.unsubscribe();
        }
    }, [fetchUserProfile, loadSubscriptions]);

    const login = async (email: string, password?: string, rememberMe: boolean = false) => {
        if (!password) throw new Error("Password is required for login");

        // Use MockService if Supabase not configured
        if (useMock || !isSupabaseConfigured()) {
            const response = await MockService.login(email, password, rememberMe);
            setUser(response.user);
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw new Error(error.message);

        if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
            if (profile) {
                await loadSubscriptions(data.user.id);
            }
        }
    };

    const signup = async (
        email: string,
        password?: string,
        username?: string,
        role: UserRole = 'fan',
        dob?: { day: number, month: number, year: number },
        countryData?: { name: string, code: string, flag: string }
    ) => {
        if (!password || !username) throw new Error("Missing required signup fields");
        if (!dob) throw new Error("Date of birth is required");

        // Use MockService if Supabase not configured
        if (useMock || !isSupabaseConfigured()) {
            const response = await MockService.signup(email, password, username, role, dob, countryData);
            setUser(response.user);
            return;
        }

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    role
                }
            }
        });

        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error('User creation failed');

        // Calculate age
        const today = new Date();
        const birthDate = new Date(dob.year, dob.month - 1, dob.day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Create user profile in our users table
        const profileData = {
            id: authData.user.id,
            email,
            username,
            display_name: username,
            role,
            date_of_birth: `${dob.year}-${String(dob.month).padStart(2, '0')}-${String(dob.day).padStart(2, '0')}`,
            age,
            age_verified: age >= 18,
            country: countryData?.name || '',
            country_code: countryData?.code || '',
            country_flag: countryData?.flag || '',
            can_post: role === 'creator',
            created_at: new Date().toISOString(),
            creator_since: role === 'creator' ? new Date().toISOString() : null
        };

        await db.users.create(profileData);

        // Fetch and set the user
        const profile = await fetchUserProfile(authData.user.id);
        setUser(profile);
    };

    const logout = async () => {
        // Update online status before logging out
        if (user && !useMock) {
            await db.users.update(user.id, {
                is_online: false,
                last_seen: new Date().toISOString()
            });
        }

        if (useMock || !isSupabaseConfigured()) {
            await MockService.logout();
        } else {
            await supabase.auth.signOut();
        }

        setUser(null);
        setSupabaseUser(null);
        setSession(null);
        setSubscribedCreatorIds([]);
    };

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) throw new Error('No user logged in');

        if (useMock || !isSupabaseConfigured()) {
            const updatedUser = await MockService.updateProfile(updates);
            setUser(updatedUser);
            return;
        }

        // Transform to DB format
        const dbUpdates: Record<string, unknown> = {};
        if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
        if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.subscriptionPrice !== undefined) dbUpdates.subscription_price = updates.subscriptionPrice;
        if (updates.messagingEnabled !== undefined) dbUpdates.messaging_enabled = updates.messagingEnabled;
        if (updates.messagingPrice !== undefined) dbUpdates.messaging_price = updates.messagingPrice;
        if (updates.contentRating !== undefined) dbUpdates.content_rating = updates.contentRating;
        if (updates.allowExplicitContent !== undefined) dbUpdates.allow_explicit_content = updates.allowExplicitContent;

        await db.users.update(user.id, dbUpdates);
        await refreshUser();
    };

    return (
        <AuthContext.Provider value={{
            user,
            supabaseUser,
            session,
            isLoggedIn: !!user,
            login,
            signup,
            logout,
            updateProfile,
            isLoading,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal,
            refreshUser,
            subscribedCreatorIds,
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
