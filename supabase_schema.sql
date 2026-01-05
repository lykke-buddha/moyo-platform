-- ============================================================================
-- MOYO PLATFORM - COMPLETE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT CHECK (role IN ('creator', 'fan')) NOT NULL DEFAULT 'fan',
  
  -- Age verification
  date_of_birth DATE,
  age INTEGER,
  age_verified BOOLEAN DEFAULT false,
  
  -- Location
  country TEXT,
  country_code TEXT,
  country_flag TEXT,
  city TEXT,
  
  -- Profile
  bio TEXT,
  avatar TEXT,
  cover_image TEXT,
  category TEXT,
  
  -- Social counts
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  subscribers_count INTEGER DEFAULT 0,
  
  -- Creator specific
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'failed', 'resubmit')),
  subscription_price DECIMAL(10,2) DEFAULT 0,
  
  -- Stats
  total_posts INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Permissions
  can_post BOOLEAN DEFAULT false,
  
  -- Content preferences
  content_rating TEXT DEFAULT 'sfw',
  allow_explicit_content BOOLEAN DEFAULT true,
  
  -- Restrictions
  is_banned BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  
  -- Messaging
  messaging_enabled BOOLEAN DEFAULT true,
  messaging_price DECIMAL(10,2) DEFAULT 0,
  auto_accept_messages BOOLEAN DEFAULT true,
  
  -- Online status
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  creator_since TIMESTAMP,
  last_login_at TIMESTAMP
);

-- ============================================================================
-- FOLLOWERS TABLE (many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
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
-- POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_username TEXT NOT NULL,
  creator_avatar TEXT,
  creator_country TEXT,
  
  type TEXT CHECK (type IN ('photo', 'video', 'album', 'text', 'poll')) NOT NULL,
  media_urls TEXT[],
  thumbnail_url TEXT,
  caption TEXT,
  
  -- Categorization
  is_nsfw BOOLEAN DEFAULT false,
  tags TEXT[],
  category TEXT,
  
  -- Visibility
  visibility TEXT CHECK (visibility IN ('free', 'subscribers', 'vip', 'premium')) DEFAULT 'subscribers',
  price DECIMAL(10,2) DEFAULT 0,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  
  -- Revenue
  revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  status TEXT CHECK (status IN ('published', 'draft', 'scheduled', 'deleted')) DEFAULT 'published',
  published_at TIMESTAMP DEFAULT NOW(),
  scheduled_for TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- LIKES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
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
-- CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
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
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
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
-- TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
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
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_followers_follower ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber ON subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================================================
-- HELPER FUNCTIONS FOR ATOMIC UPDATES
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
