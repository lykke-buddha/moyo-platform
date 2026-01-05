/**
 * useFollow Hook
 * Manages follow/unfollow state for a user
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useFollow(targetUserId: string | undefined) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        checkFollowStatus();
    }, [user, targetUserId]);

    const checkFollowStatus = useCallback(async () => {
        if (!user || !targetUserId || user.id === targetUserId) {
            setIsFollowing(false);
            setLoading(false);
            return;
        }

        if (isSupabaseConfigured()) {
            try {
                const following = await db.followers.isFollowing(user.id, targetUserId);
                setIsFollowing(following);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        } else {
            // MockService fallback
            setIsFollowing(user.following?.includes(targetUserId) || false);
        }

        setLoading(false);
    }, [user, targetUserId]);

    const follow = useCallback(async () => {
        if (!user) {
            return { success: false, error: 'Please login to follow' };
        }

        if (!targetUserId) {
            return { success: false, error: 'No user specified' };
        }

        if (user.id === targetUserId) {
            return { success: false, error: 'Cannot follow yourself' };
        }

        if (processing) {
            return { success: false, error: 'Already processing' };
        }

        try {
            setProcessing(true);

            if (isSupabaseConfigured()) {
                const result = await db.followers.follow(user.id, targetUserId);

                if (result && 'alreadyFollowing' in result) {
                    setIsFollowing(true);
                    return { success: true, message: 'Already following' };
                }

                setIsFollowing(true);

                // Create notification for target user
                await db.notifications.create({
                    user_id: targetUserId,
                    type: 'follow',
                    from_user_id: user.id,
                    from_username: user.username,
                    from_avatar: user.avatar,
                    content: `${user.displayName || user.username} started following you`,
                    action_url: `/profile/${user.username}`
                });

                return { success: true };
            } else {
                // MockService fallback
                setIsFollowing(true);
                return { success: true };
            }
        } catch (error) {
            console.error('Follow error:', error);
            return { success: false, error: (error as Error).message };
        } finally {
            setProcessing(false);
        }
    }, [user, targetUserId, processing]);

    const unfollow = useCallback(async () => {
        if (!user || !targetUserId) {
            return { success: false, error: 'Not logged in or no user' };
        }

        try {
            setProcessing(true);

            if (isSupabaseConfigured()) {
                await db.followers.unfollow(user.id, targetUserId);
            }

            setIsFollowing(false);
            return { success: true };
        } catch (error) {
            console.error('Unfollow error:', error);
            return { success: false, error: (error as Error).message };
        } finally {
            setProcessing(false);
        }
    }, [user, targetUserId]);

    const toggleFollow = useCallback(async () => {
        if (isFollowing) {
            return await unfollow();
        } else {
            return await follow();
        }
    }, [isFollowing, follow, unfollow]);

    return {
        isFollowing,
        loading,
        processing,
        follow,
        unfollow,
        toggleFollow
    };
}

export default useFollow;
