/**
 * useSubscription Hook
 * Manages subscription state for a creator
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useSubscription(creatorId: string | undefined) {
    const { user, subscribedCreatorIds, refreshUser } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
        checkSubscription();
    }, [user, creatorId, subscribedCreatorIds]);

    const checkSubscription = useCallback(async () => {
        if (!user || !creatorId) {
            setIsSubscribed(false);
            setLoading(false);
            return;
        }

        // First check cached subscriptions from context
        if (subscribedCreatorIds.includes(creatorId)) {
            setIsSubscribed(true);
            setLoading(false);
            return;
        }

        // If not in cache, check from DB
        if (isSupabaseConfigured()) {
            try {
                const subscribed = await db.subscriptions.isSubscribed(user.id, creatorId);
                setIsSubscribed(subscribed);
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        } else {
            // MockService fallback - check user.subscribedTo
            setIsSubscribed(user.subscribedTo?.includes(creatorId) || false);
        }

        setLoading(false);
    }, [user, creatorId, subscribedCreatorIds]);

    const subscribe = useCallback(async (price: number) => {
        if (!user) {
            return { success: false, error: 'Please login to subscribe' };
        }

        if (!creatorId) {
            return { success: false, error: 'No creator specified' };
        }

        if (subscribing) {
            return { success: false, error: 'Already processing' };
        }

        try {
            setSubscribing(true);

            if (isSupabaseConfigured()) {
                const result = await db.subscriptions.subscribe(user.id, creatorId, price);

                if (result.alreadySubscribed) {
                    setIsSubscribed(true);
                    return { success: true, message: 'Already subscribed' };
                }

                setIsSubscribed(true);

                // Create notification for creator
                await db.notifications.create({
                    user_id: creatorId,
                    type: 'subscription',
                    from_user_id: user.id,
                    from_username: user.username,
                    from_avatar: user.avatar,
                    content: `${user.displayName || user.username} subscribed to you!`,
                    action_url: `/profile/${user.username}`
                });

                // Refresh user context to update cached subscriptions
                await refreshUser();

                return { success: true, data: result.data };
            } else {
                // MockService fallback - simulate subscription
                // In real app, this would call MockService methods
                setIsSubscribed(true);
                return { success: true };
            }
        } catch (error) {
            console.error('Subscribe error:', error);
            return { success: false, error: (error as Error).message };
        } finally {
            setSubscribing(false);
        }
    }, [user, creatorId, subscribing, refreshUser]);

    const unsubscribe = useCallback(async () => {
        if (!user || !creatorId) {
            return { success: false, error: 'Not logged in or no creator' };
        }

        try {
            setSubscribing(true);

            if (isSupabaseConfigured()) {
                await db.subscriptions.unsubscribe(user.id, creatorId);
            }

            setIsSubscribed(false);
            await refreshUser();

            return { success: true };
        } catch (error) {
            console.error('Unsubscribe error:', error);
            return { success: false, error: (error as Error).message };
        } finally {
            setSubscribing(false);
        }
    }, [user, creatorId, refreshUser]);

    return {
        isSubscribed,
        loading,
        subscribing,
        subscribe,
        unsubscribe,
        checkSubscription
    };
}

export default useSubscription;
