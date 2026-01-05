-- ============================================================================
-- MOYO PLATFORM - ROW LEVEL SECURITY POLICIES
-- Run this AFTER supabase_schema.sql
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- FOLLOWERS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view followers" ON followers;
CREATE POLICY "Anyone can view followers" ON followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create followers" ON followers;
CREATE POLICY "Users can create followers" ON followers FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can delete own follows" ON followers;
CREATE POLICY "Users can delete own follows" ON followers FOR DELETE USING (auth.uid() = follower_id);

-- ============================================================================
-- SUBSCRIPTIONS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can create subscriptions" ON subscriptions;
CREATE POLICY "Users can create subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = subscriber_id);

-- ============================================================================
-- POSTS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view published posts" ON posts;
CREATE POLICY "Anyone can view published posts" ON posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Creators can create posts" ON posts;
CREATE POLICY "Creators can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update own posts" ON posts;
CREATE POLICY "Creators can update own posts" ON posts FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can delete own posts" ON posts;
CREATE POLICY "Creators can delete own posts" ON posts FOR DELETE USING (auth.uid() = creator_id);

-- ============================================================================
-- LIKES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view likes" ON likes;
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create likes" ON likes;
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON likes;
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- MESSAGES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update own sent messages" ON messages;
CREATE POLICY "Users can update own sent messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- ============================================================================
-- CONVERSATIONS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRANSACTIONS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = subscriber_id);

DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
