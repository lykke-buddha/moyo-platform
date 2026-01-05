-- ============================================================================
-- MOYO PLATFORM - COMPLETE SETUP SCRIPT
-- Run this SINGLE script in your Supabase SQL Editor
-- It combines: schema + RLS + seed data in the correct order
-- ============================================================================

-- ============================================================================
-- STEP 1: ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 2: DROP ALL EXISTING TABLES (clean slate)
-- ============================================================================
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- STEP 3: CREATE USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT CHECK (role IN ('creator', 'fan')) NOT NULL DEFAULT 'fan',
  date_of_birth DATE,
  age INTEGER,
  age_verified BOOLEAN DEFAULT false,
  country TEXT,
  country_code TEXT,
  country_flag TEXT,
  city TEXT,
  bio TEXT,
  avatar TEXT,
  cover_image TEXT,
  category TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  subscribers_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'failed', 'resubmit')),
  subscription_price DECIMAL(10,2) DEFAULT 0,
  total_posts INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  can_post BOOLEAN DEFAULT false,
  content_rating TEXT DEFAULT 'sfw',
  allow_explicit_content BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  messaging_enabled BOOLEAN DEFAULT true,
  messaging_price DECIMAL(10,2) DEFAULT 0,
  auto_accept_messages BOOLEAN DEFAULT true,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  creator_since TIMESTAMP,
  last_login_at TIMESTAMP
);

-- ============================================================================
-- STEP 4: CREATE FOLLOWERS TABLE
-- ============================================================================
CREATE TABLE followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================================
-- STEP 5: CREATE SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT DEFAULT 'basic',
  price DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'paused')) DEFAULT 'active',
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  UNIQUE(subscriber_id, creator_id)
);

-- ============================================================================
-- STEP 6: CREATE POSTS TABLE
-- ============================================================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_username TEXT NOT NULL,
  creator_avatar TEXT,
  creator_country TEXT,
  type TEXT CHECK (type IN ('photo', 'video', 'album', 'text', 'poll')) NOT NULL,
  media_urls TEXT[],
  thumbnail_url TEXT,
  caption TEXT,
  is_nsfw BOOLEAN DEFAULT false,
  tags TEXT[],
  category TEXT,
  visibility TEXT CHECK (visibility IN ('free', 'subscribers', 'vip', 'premium')) DEFAULT 'subscribers',
  price DECIMAL(10,2) DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('published', 'draft', 'scheduled', 'deleted')) DEFAULT 'published',
  published_at TIMESTAMP DEFAULT NOW(),
  scheduled_for TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 7: CREATE LIKES TABLE
-- ============================================================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- ============================================================================
-- STEP 8: CREATE MESSAGES TABLE
-- ============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('text', 'image', 'video', 'gif')) DEFAULT 'text',
  content TEXT,
  media_urls TEXT[],
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP,
  reply_to_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 9: CREATE CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP,
  last_message_sender_id UUID REFERENCES users(id),
  unread_count_p1 INTEGER DEFAULT 0,
  unread_count_p2 INTEGER DEFAULT 0,
  is_muted_p1 BOOLEAN DEFAULT false,
  is_muted_p2 BOOLEAN DEFAULT false,
  is_archived_p1 BOOLEAN DEFAULT false,
  is_archived_p2 BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id)
);

-- ============================================================================
-- STEP 10: CREATE NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  from_username TEXT,
  from_avatar TEXT,
  content TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 11: CREATE TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('subscription', 'post_purchase', 'tip', 'payout')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================================================
-- STEP 12: CREATE INDEXES
-- ============================================================================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_followers_follower ON followers(follower_id);
CREATE INDEX idx_followers_following ON followers(following_id);
CREATE INDEX idx_subscriptions_subscriber ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_creator ON subscriptions(creator_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_posts_creator ON posts(creator_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================================
-- STEP 13: CREATE HELPER FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_followers_count(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET followers_count = followers_count + 1 WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_followers_count(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET followers_count = GREATEST(0, followers_count - 1) WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_following_count(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET following_count = following_count + 1 WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_following_count(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET following_count = GREATEST(0, following_count - 1) WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_subscribers_count(creator_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET subscribers_count = subscribers_count + 1 WHERE id = creator_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_subscribers_count(creator_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET subscribers_count = GREATEST(0, subscribers_count - 1) WHERE id = creator_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_earnings(creator_uuid UUID, amount_to_add DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE users SET total_earnings = total_earnings + amount_to_add WHERE id = creator_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_post_likes(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 14: ENABLE ROW LEVEL SECURITY
-- ============================================================================
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
-- STEP 15: CREATE RLS POLICIES
-- ============================================================================

-- USERS POLICIES
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- FOLLOWERS POLICIES
CREATE POLICY "Anyone can view followers" ON followers FOR SELECT USING (true);
CREATE POLICY "Users can create followers" ON followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON followers FOR DELETE USING (auth.uid() = follower_id);

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can create subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = subscriber_id);

-- POSTS POLICIES
CREATE POLICY "Anyone can view published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Creators can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own posts" ON posts FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete own posts" ON posts FOR DELETE USING (auth.uid() = creator_id);

-- LIKES POLICIES
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- MESSAGES POLICIES
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own sent messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- CONVERSATIONS POLICIES
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- TRANSACTIONS POLICIES
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = subscriber_id);
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

-- ============================================================================
-- STEP 16: SEED WITH SAMPLE DATA
-- ============================================================================

-- Insert 20 African Creators
INSERT INTO users (id, email, username, display_name, role, bio, avatar, cover_image, country, country_code, country_flag, category, subscription_price, subscribers_count, followers_count, total_posts, total_likes, engagement_rate, is_verified, age_verified, can_post, content_rating, messaging_enabled)
VALUES
('c0000001-0000-0000-0000-000000000001', 'thandi@moyo.com', 'thandi_vibes', 'Thandi Vibes', 'creator', 
 '🌍 South African lifestyle & fashion creator. Living my best life in Joburg! 💃', 
 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', 
 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=800',
 'South Africa', 'ZA', '🇿🇦', 'Fashion', 2500, 15420, 28500, 156, 89000, 12.5, true, true, true, 'sfw', true),

('c0000002-0000-0000-0000-000000000002', 'lerato@moyo.com', 'lerato_fitness', 'Lerato Fit', 'creator',
 '💪 Certified personal trainer | Transform your body, transform your life | DM for coaching',
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
 'South Africa', 'ZA', '🇿🇦', 'Fitness', 3500, 8750, 19200, 234, 67000, 15.2, true, true, true, 'sfw', true),

('c0000003-0000-0000-0000-000000000003', 'amaka@moyo.com', 'amaka_beauty', 'Amaka Beauty', 'creator',
 '💄 Lagos makeup artist | Tutorials & tips | Book me for your special day ✨',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
 'Nigeria', 'NG', '🇳🇬', 'Beauty', 2000, 22100, 45600, 312, 156000, 18.3, true, true, true, 'sfw', true),

('c0000004-0000-0000-0000-000000000004', 'chidi@moyo.com', 'chidi_comedy', 'Chidi Comedy', 'creator',
 '😂 Making Africa laugh one skit at a time | Bookings: dm me',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
 'Nigeria', 'NG', '🇳🇬', 'Comedy', 1500, 45000, 89000, 189, 234000, 22.1, true, true, true, 'sfw', true),

('c0000005-0000-0000-0000-000000000005', 'wanjiku@moyo.com', 'wanjiku_cooks', 'Chef Wanjiku', 'creator',
 '👨‍🍳 Nairobi chef | African fusion recipes | Cookbook coming soon!',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
 'Kenya', 'KE', '🇰🇪', 'Cooking', 1800, 12300, 28900, 267, 78000, 14.6, true, true, true, 'sfw', true),

('c0000006-0000-0000-0000-000000000006', 'omondi@moyo.com', 'omondi_music', 'DJ Omondi', 'creator',
 '🎵 Afrobeats | Amapiano | Live sets every Friday | Kenya''s #1',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
 'Kenya', 'KE', '🇰🇪', 'Music', 4000, 18500, 42000, 145, 112000, 16.8, true, true, true, 'sfw', true),

('c0000007-0000-0000-0000-000000000007', 'akua@moyo.com', 'akua_dance', 'Akua Dance', 'creator',
 '💃 Professional dancer | Azonto queen | Teaching classes in Accra',
 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
 'Ghana', 'GH', '🇬🇭', 'Dance', 2200, 9800, 21500, 198, 54000, 13.9, true, true, true, 'sfw', true),

('c0000008-0000-0000-0000-000000000008', 'kwame@moyo.com', 'kwame_art', 'Kwame Art', 'creator',
 '🎨 Contemporary African art | Commissions open | Gallery exhibitions',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
 'Ghana', 'GH', '🇬🇭', 'Art', 3000, 6500, 14200, 87, 32000, 11.2, true, true, true, 'sfw', true),

('c0000009-0000-0000-0000-000000000009', 'fatima@moyo.com', 'fatima_travel', 'Fatima Explores', 'creator',
 '✈️ Travel blogger | 25 countries | Cairo based | Partnerships welcome',
 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800',
 'Egypt', 'EG', '🇪🇬', 'Travel', 2800, 28900, 56000, 342, 189000, 19.4, true, true, true, 'sfw', true),

('c0000010-0000-0000-0000-000000000010', 'youssef@moyo.com', 'youssef_fitness', 'Youssef Gains', 'creator',
 '💪 Marrakech personal trainer | Transformation specialist | Free tips daily',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
 'Morocco', 'MA', '🇲🇦', 'Fitness', 2500, 11200, 24500, 178, 67000, 14.1, true, true, true, 'sfw', true);

-- Insert 5 Fan Accounts
INSERT INTO users (id, email, username, display_name, role, avatar, country, country_code, country_flag, age_verified, can_post)
VALUES
('f0000001-0000-0000-0000-000000000001', 'sipho@gmail.com', 'sipho_fan', 'Sipho', 'fan', 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=sipho', 'South Africa', 'ZA', '🇿🇦', true, false),
('f0000002-0000-0000-0000-000000000002', 'amina@gmail.com', 'amina_loves', 'Amina', 'fan',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina', 'Nigeria', 'NG', '🇳🇬', true, false),
('f0000003-0000-0000-0000-000000000003', 'john@gmail.com', 'john_viewer', 'John', 'fan',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 'Kenya', 'KE', '🇰🇪', true, false),
('f0000004-0000-0000-0000-000000000004', 'fatou@gmail.com', 'fatou_vibes', 'Fatou', 'fan',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatou', 'Senegal', 'SN', '🇸🇳', true, false),
('f0000005-0000-0000-0000-000000000005', 'david@gmail.com', 'david_sub', 'David', 'fan',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', 'Ghana', 'GH', '🇬🇭', true, false);

-- Insert Sample Posts (with working Unsplash images)
INSERT INTO posts (id, creator_id, creator_username, creator_avatar, creator_country, type, caption, media_urls, thumbnail_url, visibility, price, likes_count, comments_count, views_count, status)
VALUES
-- Thandi's posts
('a0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'thandi_vibes', 
 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', 'South Africa', 'photo',
 'New day, new outfit! 🔥 What do you think of this look?',
 ARRAY['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'], 
 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
 'free', 0, 2450, 156, 12000, 'published'),

('a0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'thandi_vibes',
 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', 'South Africa', 'photo',
 'Exclusive BTS from my photoshoot 📸 Subscribers only!',
 ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'],
 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
 'subscribers', 2500, 890, 42, 5600, 'published'),

-- Lerato's posts
('a0000003-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000002', 'lerato_fitness',
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'South Africa', 'photo',
 'Morning workout complete! 💪 Who else is crushing their goals today?',
 ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'],
 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
 'free', 0, 1890, 98, 8900, 'published'),

-- Amaka's posts
('a0000004-0000-0000-0000-000000000004', 'c0000003-0000-0000-0000-000000000003', 'amaka_beauty',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 'Nigeria', 'photo',
 'Tutorial time! 💄 Learn this look - link in bio',
 ARRAY['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
 'free', 0, 3200, 178, 15600, 'published'),

-- Chidi's posts  
('a0000005-0000-0000-0000-000000000005', 'c0000004-0000-0000-0000-000000000004', 'chidi_comedy',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Nigeria', 'photo',
 '😂 When your African mom calls you by your full government name...',
 ARRAY['https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800'],
 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400',
 'free', 0, 5600, 340, 28000, 'published'),

-- Wanjiku's posts
('a0000006-0000-0000-0000-000000000006', 'c0000005-0000-0000-0000-000000000005', 'wanjiku_cooks',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Kenya', 'photo',
 '🍲 Today we''re making Nyama Choma! Full recipe for subscribers',
 ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
 'subscribers', 1800, 1560, 89, 7800, 'published'),

-- DJ Omondi's posts
('a0000007-0000-0000-0000-000000000007', 'c0000006-0000-0000-0000-000000000006', 'omondi_music',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Kenya', 'photo',
 '🎵 Live set tonight! Who''s tuning in?',
 ARRAY['https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800'],
 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400',
 'free', 0, 2800, 156, 14500, 'published'),

-- Akua's posts
('a0000008-0000-0000-0000-000000000008', 'c0000007-0000-0000-0000-000000000007', 'akua_dance',
 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', 'Ghana', 'photo',
 '💃 New choreography dropping soon! Stay tuned',
 ARRAY['https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800'],
 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
 'free', 0, 1890, 78, 9200, 'published');

-- Insert Sample Subscriptions
INSERT INTO subscriptions (subscriber_id, creator_id, price, status, started_at, expires_at)
VALUES
('f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 2500, 'active', NOW(), NOW() + INTERVAL '30 days'),
('f0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002', 3500, 'active', NOW(), NOW() + INTERVAL '30 days'),
('f0000002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003', 2000, 'active', NOW(), NOW() + INTERVAL '30 days');

-- Insert Sample Followers
INSERT INTO followers (follower_id, following_id)
VALUES
('f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001'),
('f0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002'),
('f0000002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003'),
('f0000003-0000-0000-0000-000000000003', 'c0000004-0000-0000-0000-000000000004');

-- ============================================================================
-- DONE! Your database now has:
-- - 10 creators from African countries
-- - 5 fan accounts  
-- - 8 sample posts
-- - Sample subscriptions and follows
-- ============================================================================
