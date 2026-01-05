/**
 * useConversations Hook
 * Manages list of conversations for current user
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ConversationPreview {
    id: string;
    otherUserId: string;
    otherUsername?: string;
    otherAvatar?: string;
    otherDisplayName?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
    isOnline?: boolean;
}

export function useConversations() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalUnread, setTotalUnread] = useState(0);

    useEffect(() => {
        if (user) {
            loadConversations();
        } else {
            setConversations([]);
            setLoading(false);
        }
    }, [user]);

    // Real-time updates for new conversations/messages
    useEffect(() => {
        if (!user || !isSupabaseConfigured()) return;

        const channel = supabase
            .channel(`user-conversations:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `or(participant1_id.eq.${user.id},participant2_id.eq.${user.id})`
                },
                () => {
                    // Reload conversations on any change
                    loadConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const loadConversations = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            if (isSupabaseConfigured()) {
                const convs = await db.messages.getConversations(user.id);

                const previews: ConversationPreview[] = await Promise.all(
                    convs.map(async (conv: Record<string, unknown>) => {
                        const otherUserId = conv.participant1_id === user.id
                            ? conv.participant2_id as string
                            : conv.participant1_id as string;

                        const unreadCount = conv.participant1_id === user.id
                            ? (conv.unread_count_p1 as number) || 0
                            : (conv.unread_count_p2 as number) || 0;

                        // Fetch other user details
                        const otherUser = await db.users.getById(otherUserId);

                        return {
                            id: conv.id as string,
                            otherUserId,
                            otherUsername: otherUser?.username,
                            otherAvatar: otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username}`,
                            otherDisplayName: otherUser?.display_name || otherUser?.username,
                            lastMessage: conv.last_message as string | undefined,
                            lastMessageAt: conv.last_message_at as string | undefined,
                            unreadCount,
                            isOnline: otherUser?.is_online
                        };
                    })
                );

                setConversations(previews);
                setTotalUnread(previews.reduce((sum, c) => sum + c.unreadCount, 0));
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    return {
        conversations,
        loading,
        totalUnread,
        refresh: loadConversations
    };
}

export default useConversations;
