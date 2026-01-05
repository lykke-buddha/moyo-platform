/**
 * Database Abstraction Layer for Supabase
 * Provides typed methods for all database operations
 */

import { supabase, isSupabaseConfigured } from './supabase';

// ============================================================================
// USERS
// ============================================================================
export const db = {
    users: {
        async getById(id: string) {
            if (!isSupabaseConfigured()) return null;
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching user by id:', error);
                return null;
            }
            return data;
        },

        async getByUsername(username: string) {
            if (!isSupabaseConfigured()) return null;
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();
            if (error) {
                console.error('Error fetching user by username:', error);
                return null;
            }
            return data;
        },

        async getByEmail(email: string) {
            if (!isSupabaseConfigured()) return null;
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            if (error) return null;
            return data;
        },

        async create(userData: Record<string, unknown>) {
            if (!isSupabaseConfigured()) return null;
            const { data, error } = await supabase
                .from('users')
                .insert(userData)
                .select()
                .single();
            if (error) {
                console.error('Error creating user:', error);
                throw error;
            }
            return data;
        },

        async update(id: string, updates: Record<string, unknown>) {
            if (!isSupabaseConfigured()) return null;
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                console.error('Error updating user:', error);
                throw error;
            }
            return data;
        },

        async getCreators(limit = 50) {
            if (!isSupabaseConfigured()) return [];
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'creator')
                .order('subscribers_count', { ascending: false })
                .limit(limit);
            if (error) {
                console.error('Error fetching creators:', error);
                return [];
            }
            return data || [];
        },

        async search(query: string, limit = 20) {
            if (!isSupabaseConfigured()) return [];
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'creator')
                .or(`username.ilike.%${query}%,display_name.ilike.%${query}%,category.ilike.%${query}%`)
                .limit(limit);
            if (error) return [];
            return data || [];
        }
    },

    // ============================================================================
    // FOLLOWERS
    // ============================================================================
    followers: {
        async follow(followerId: string, followingId: string) {
            if (!isSupabaseConfigured()) return null;

            // Insert follow relationship
            const { data, error } = await supabase
                .from('followers')
                .insert({ follower_id: followerId, following_id: followingId })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Already following
                    return { alreadyFollowing: true };
                }
                console.error('Error following:', error);
                throw error;
            }

            // Update counts atomically
            await supabase.rpc('increment_followers_count', { user_uuid: followingId });
            await supabase.rpc('increment_following_count', { user_uuid: followerId });

            return data;
        },

        async unfollow(followerId: string, followingId: string) {
            if (!isSupabaseConfigured()) return;

            const { error } = await supabase
                .from('followers')
                .delete()
                .eq('follower_id', followerId)
                .eq('following_id', followingId);

            if (error) {
                console.error('Error unfollowing:', error);
                throw error;
            }

            // Update counts atomically
            await supabase.rpc('decrement_followers_count', { user_uuid: followingId });
            await supabase.rpc('decrement_following_count', { user_uuid: followerId });
        },

        async isFollowing(followerId: string, followingId: string): Promise<boolean> {
            if (!isSupabaseConfigured()) return false;

            const { data } = await supabase
                .from('followers')
                .select('id')
                .eq('follower_id', followerId)
                .eq('following_id', followingId)
                .maybeSingle();

            return !!data;
        },

        async getFollowers(userId: string) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('followers')
                .select(`
                    follower_id,
                    users!followers_follower_id_fkey (*)
                `)
                .eq('following_id', userId);

            if (error) return [];
            return data?.map((f: Record<string, unknown>) => f.users) || [];
        },

        async getFollowing(userId: string) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('followers')
                .select(`
                    following_id,
                    users!followers_following_id_fkey (*)
                `)
                .eq('follower_id', userId);

            if (error) return [];
            return data?.map((f: Record<string, unknown>) => f.users) || [];
        }
    },

    // ============================================================================
    // SUBSCRIPTIONS
    // ============================================================================
    subscriptions: {
        async subscribe(subscriberId: string, creatorId: string, price: number) {
            if (!isSupabaseConfigured()) return { data: null, alreadySubscribed: false };

            // Check existing active subscription
            const { data: existing } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('subscriber_id', subscriberId)
                .eq('creator_id', creatorId)
                .eq('status', 'active')
                .maybeSingle();

            if (existing) {
                return { data: existing, alreadySubscribed: true };
            }

            // Create new subscription
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            const { data, error } = await supabase
                .from('subscriptions')
                .upsert({
                    subscriber_id: subscriberId,
                    creator_id: creatorId,
                    price,
                    status: 'active',
                    started_at: new Date().toISOString(),
                    expires_at: expiresAt.toISOString()
                }, { onConflict: 'subscriber_id,creator_id' })
                .select()
                .single();

            if (error) {
                console.error('Subscription error:', error);
                throw error;
            }

            // Update subscriber count
            await supabase.rpc('increment_subscribers_count', { creator_uuid: creatorId });

            // Create transaction record
            await supabase.from('transactions').insert({
                creator_id: creatorId,
                subscriber_id: subscriberId,
                type: 'subscription',
                amount: price,
                currency: 'ZAR',
                status: 'completed',
                description: 'Monthly subscription',
                completed_at: new Date().toISOString()
            });

            // Add 80% earnings to creator (20% platform fee)
            await supabase.rpc('add_earnings', {
                creator_uuid: creatorId,
                amount_to_add: price * 0.8
            });

            return { data, alreadySubscribed: false };
        },

        async unsubscribe(subscriberId: string, creatorId: string) {
            if (!isSupabaseConfigured()) return;

            const { error } = await supabase
                .from('subscriptions')
                .update({
                    status: 'cancelled',
                    cancelled_at: new Date().toISOString()
                })
                .eq('subscriber_id', subscriberId)
                .eq('creator_id', creatorId)
                .eq('status', 'active');

            if (error) throw error;

            await supabase.rpc('decrement_subscribers_count', { creator_uuid: creatorId });
        },

        async isSubscribed(subscriberId: string, creatorId: string): Promise<boolean> {
            if (!isSupabaseConfigured()) return false;

            const { data } = await supabase
                .from('subscriptions')
                .select('id')
                .eq('subscriber_id', subscriberId)
                .eq('creator_id', creatorId)
                .eq('status', 'active')
                .maybeSingle();

            return !!data;
        },

        async getSubscriptions(subscriberId: string) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('subscriptions')
                .select(`
                    *,
                    users!subscriptions_creator_id_fkey (*)
                `)
                .eq('subscriber_id', subscriberId)
                .eq('status', 'active');

            if (error) return [];
            return data || [];
        },

        async getSubscribedCreatorIds(subscriberId: string): Promise<string[]> {
            if (!isSupabaseConfigured()) return [];

            const { data } = await supabase
                .from('subscriptions')
                .select('creator_id')
                .eq('subscriber_id', subscriberId)
                .eq('status', 'active');

            return data?.map((s: { creator_id: string }) => s.creator_id) || [];
        }
    },

    // ============================================================================
    // POSTS
    // ============================================================================
    posts: {
        async getAll(limit = 50, offset = 0) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) return [];
            return data || [];
        },

        async getByCreator(creatorId: string) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('creator_id', creatorId)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) return [];
            return data || [];
        },

        async create(post: Record<string, unknown>) {
            if (!isSupabaseConfigured()) return null;

            const { data, error } = await supabase
                .from('posts')
                .insert(post)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async like(userId: string, postId: string) {
            if (!isSupabaseConfigured()) return { liked: false };

            // Check if already liked
            const { data: existing } = await supabase
                .from('likes')
                .select('id')
                .eq('user_id', userId)
                .eq('post_id', postId)
                .maybeSingle();

            if (existing) {
                // Unlike
                await supabase
                    .from('likes')
                    .delete()
                    .eq('user_id', userId)
                    .eq('post_id', postId);

                await supabase.rpc('decrement_post_likes', { post_uuid: postId });
                return { liked: false };
            } else {
                // Like
                await supabase
                    .from('likes')
                    .insert({ user_id: userId, post_id: postId });

                await supabase.rpc('increment_post_likes', { post_uuid: postId });
                return { liked: true };
            }
        },

        async hasLiked(userId: string, postId: string): Promise<boolean> {
            if (!isSupabaseConfigured()) return false;

            const { data } = await supabase
                .from('likes')
                .select('id')
                .eq('user_id', userId)
                .eq('post_id', postId)
                .maybeSingle();

            return !!data;
        },

        async getLikedPostIds(userId: string): Promise<string[]> {
            if (!isSupabaseConfigured()) return [];

            const { data } = await supabase
                .from('likes')
                .select('post_id')
                .eq('user_id', userId);

            return data?.map((l: { post_id: string }) => l.post_id) || [];
        }
    },

    // ============================================================================
    // MESSAGES
    // ============================================================================
    messages: {
        async getConversation(userId1: string, userId2: string) {
            if (!isSupabaseConfigured()) return null;

            // Find conversation
            const { data: conv } = await supabase
                .from('conversations')
                .select('*')
                .or(`and(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),and(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`)
                .maybeSingle();

            if (!conv) return null;

            // Get messages
            const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: true });

            return { conversation: conv, messages: messages || [] };
        },

        async send(senderId: string, recipientId: string, content: string, type = 'text') {
            if (!isSupabaseConfigured()) return null;

            // Get or create conversation
            let { data: conv } = await supabase
                .from('conversations')
                .select('*')
                .or(`and(participant1_id.eq.${senderId},participant2_id.eq.${recipientId}),and(participant1_id.eq.${recipientId},participant2_id.eq.${senderId})`)
                .maybeSingle();

            if (!conv) {
                const { data: newConv, error } = await supabase
                    .from('conversations')
                    .insert({
                        participant1_id: senderId,
                        participant2_id: recipientId
                    })
                    .select()
                    .single();

                if (error) throw error;
                conv = newConv;
            }

            // Send message
            const { data: message, error: msgError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conv.id,
                    sender_id: senderId,
                    recipient_id: recipientId,
                    type,
                    content
                })
                .select()
                .single();

            if (msgError) throw msgError;

            // Update conversation
            const unreadField = conv.participant1_id === recipientId
                ? 'unread_count_p1'
                : 'unread_count_p2';

            await supabase
                .from('conversations')
                .update({
                    last_message: content,
                    last_message_at: new Date().toISOString(),
                    last_message_sender_id: senderId,
                    [unreadField]: (conv[unreadField] || 0) + 1
                })
                .eq('id', conv.id);

            return message;
        },

        async getConversations(userId: string) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                .order('last_message_at', { ascending: false });

            if (error) return [];
            return data || [];
        },

        async markAsRead(conversationId: string, userId: string) {
            if (!isSupabaseConfigured()) return;

            // Get conversation
            const { data: conv } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', conversationId)
                .single();

            if (!conv) return;

            const unreadField = conv.participant1_id === userId
                ? 'unread_count_p1'
                : 'unread_count_p2';

            await supabase
                .from('conversations')
                .update({ [unreadField]: 0 })
                .eq('id', conversationId);

            // Mark messages as read
            await supabase
                .from('messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('conversation_id', conversationId)
                .eq('recipient_id', userId)
                .eq('is_read', false);
        }
    },

    // ============================================================================
    // NOTIFICATIONS
    // ============================================================================
    notifications: {
        async getAll(userId: string, limit = 50) {
            if (!isSupabaseConfigured()) return [];

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) return [];
            return data || [];
        },

        async markAsRead(notificationId: string) {
            if (!isSupabaseConfigured()) return;

            await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId);
        },

        async markAllAsRead(userId: string) {
            if (!isSupabaseConfigured()) return;

            await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('is_read', false);
        },

        async create(notification: Record<string, unknown>) {
            if (!isSupabaseConfigured()) return null;

            const { data, error } = await supabase
                .from('notifications')
                .insert(notification)
                .select()
                .single();

            if (error) return null;
            return data;
        }
    }
};

export default db;
