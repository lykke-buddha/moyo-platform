/**
 * useMessages Hook
 * Manages messaging with a specific user
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    recipientId: string;
    type: 'text' | 'image' | 'video' | 'tip';
    content: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}

interface Conversation {
    id: string;
    participant1Id: string;
    participant2Id: string;
    lastMessage?: string;
    lastMessageAt?: string;
    lastMessageSenderId?: string;
    unreadCount: number;
}

export function useMessages(otherUserId?: string) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Load conversation and messages
    useEffect(() => {
        if (user && otherUserId) {
            loadConversation();
        } else {
            setLoading(false);
        }
    }, [user, otherUserId]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!conversation?.id || !isSupabaseConfigured()) return;

        const channel = supabase
            .channel(`messages:${conversation.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversation.id}`
                },
                (payload) => {
                    const newMessage = transformMessage(payload.new as Record<string, unknown>);
                    setMessages(prev => [...prev, newMessage]);

                    // Mark as read if we're the recipient
                    if (user && newMessage.recipientId === user.id) {
                        db.messages.markAsRead(conversation.id, user.id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversation?.id, user]);

    const transformMessage = (msg: Record<string, unknown>): Message => ({
        id: msg.id as string,
        conversationId: msg.conversation_id as string,
        senderId: msg.sender_id as string,
        recipientId: msg.recipient_id as string,
        type: msg.type as 'text' | 'image' | 'video' | 'tip',
        content: msg.content as string,
        isRead: msg.is_read as boolean,
        readAt: msg.read_at as string | undefined,
        createdAt: msg.created_at as string
    });

    const loadConversation = useCallback(async () => {
        if (!user || !otherUserId) return;

        setLoading(true);
        try {
            if (isSupabaseConfigured()) {
                const result = await db.messages.getConversation(user.id, otherUserId);

                if (result) {
                    setConversation({
                        id: result.conversation.id,
                        participant1Id: result.conversation.participant1_id,
                        participant2Id: result.conversation.participant2_id,
                        lastMessage: result.conversation.last_message,
                        lastMessageAt: result.conversation.last_message_at,
                        lastMessageSenderId: result.conversation.last_message_sender_id,
                        unreadCount: user.id === result.conversation.participant1_id
                            ? result.conversation.unread_count_p1 || 0
                            : result.conversation.unread_count_p2 || 0
                    });
                    setMessages(result.messages.map(transformMessage));

                    // Mark messages as read
                    await db.messages.markAsRead(result.conversation.id, user.id);
                }
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        } finally {
            setLoading(false);
        }
    }, [user, otherUserId]);

    const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'video' | 'tip' = 'text') => {
        if (!user || !otherUserId || !content.trim()) {
            return { success: false, error: 'Invalid message' };
        }

        if (sending) {
            return { success: false, error: 'Already sending' };
        }

        try {
            setSending(true);

            if (isSupabaseConfigured()) {
                const message = await db.messages.send(user.id, otherUserId, content, type);

                if (message) {
                    // Optimistically add to local state (real-time will also trigger)
                    const newMessage = transformMessage(message);
                    setMessages(prev => {
                        // Avoid duplicates
                        if (prev.some(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });

                    // Create notification for recipient
                    await db.notifications.create({
                        user_id: otherUserId,
                        type: 'message',
                        from_user_id: user.id,
                        from_username: user.username,
                        from_avatar: user.avatar,
                        content: `New message from ${user.displayName || user.username}`,
                        action_url: `/messages/${user.username}`
                    });

                    return { success: true, message: newMessage };
                }
            }

            return { success: false, error: 'Failed to send message' };
        } catch (error) {
            console.error('Send message error:', error);
            return { success: false, error: (error as Error).message };
        } finally {
            setSending(false);
        }
    }, [user, otherUserId, sending]);

    return {
        messages,
        conversation,
        loading,
        sending,
        sendMessage,
        loadConversation
    };
}

export default useMessages;
