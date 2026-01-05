-- ============================================================================
-- DUMMY DATA SEED SCRIPT FOR MOYO PLATFORM
-- Run this AFTER supabase_schema.sql and supabase_rls.sql
-- ============================================================================

-- ============================================================================
-- CREATORS (20 African Creators)
-- ============================================================================

INSERT INTO users (id, email, username, display_name, role, bio, avatar, cover_image, country, country_code, country_flag, category, subscription_price, subscribers_count, followers_count, total_posts, total_likes, engagement_rate, is_verified, age_verified, can_post, content_rating, messaging_enabled)
VALUES
-- South Africa
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

-- Nigeria
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

-- Kenya
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

-- Ghana
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

-- Egypt
('c0000009-0000-0000-0000-000000000009', 'fatima@moyo.com', 'fatima_travel', 'Fatima Explores', 'creator',
 '✈️ Travel blogger | 25 countries | Cairo based | Partnerships welcome',
 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800',
 'Egypt', 'EG', '🇪🇬', 'Travel', 2800, 28900, 56000, 342, 189000, 19.4, true, true, true, 'sfw', true),

-- Morocco
('c0000010-0000-0000-0000-000000000010', 'youssef@moyo.com', 'youssef_fitness', 'Youssef Gains', 'creator',
 '💪 Marrakech personal trainer | Transformation specialist | Free tips daily',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
 'Morocco', 'MA', '🇲🇦', 'Fitness', 2500, 11200, 24500, 178, 67000, 14.1, true, true, true, 'sfw', true),

-- Tanzania
('c0000011-0000-0000-0000-000000000011', 'neema@moyo.com', 'neema_fashion', 'Neema Style', 'creator',
 '👗 Dar es Salaam fashionista | African prints | Sustainable fashion advocate',
 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
 'Tanzania', 'TZ', '🇹🇿', 'Fashion', 1800, 7600, 16800, 145, 42000, 12.8, true, true, true, 'sfw', true),

-- Ethiopia
('c0000012-0000-0000-0000-000000000012', 'abel@moyo.com', 'abel_music', 'Abel Melodies', 'creator',
 '🎤 Ethiopian singer | Traditional meets modern | New album dropping soon',
 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
 'Ethiopia', 'ET', '🇪🇹', 'Music', 3500, 14300, 31200, 92, 78000, 15.6, true, true, true, 'sfw', true),

-- Senegal
('c0000013-0000-0000-0000-000000000013', 'aissatou@moyo.com', 'aissatou_beauty', 'Aissatou Glow', 'creator',
 '✨ Dakar beauty guru | Skincare secrets | Natural hair journey',
 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
 'Senegal', 'SN', '🇸🇳', 'Beauty', 2000, 8900, 19600, 167, 48000, 13.2, true, true, true, 'sfw', true),

-- Cameroon
('c0000014-0000-0000-0000-000000000014', 'pascal@moyo.com', 'pascal_tech', 'Pascal Tech', 'creator',
 '💻 Software developer | Tech tutorials | Building Africa''s future',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
 'Cameroon', 'CM', '🇨🇲', 'Tech', 2500, 5400, 12300, 234, 28000, 10.5, true, true, true, 'sfw', true),

-- Côte d'Ivoire
('c0000015-0000-0000-0000-000000000015', 'marie@moyo.com', 'marie_lifestyle', 'Marie Ivoirienne', 'creator',
 '🌴 Abidjan lifestyle | Food & culture | Living la vie en rose',
 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400',
 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
 'Côte d''Ivoire', 'CI', '🇨🇮', 'Lifestyle', 1500, 6700, 15400, 189, 38000, 12.1, true, true, true, 'sfw', true),

-- Uganda
('c0000016-0000-0000-0000-000000000016', 'brian@moyo.com', 'brian_comedy', 'Brian Laughs', 'creator',
 '😂 Kampala comedian | Skits & stand-up | Making East Africa laugh',
 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
 'Uganda', 'UG', '🇺🇬', 'Comedy', 1200, 12800, 28700, 156, 89000, 17.8, true, true, true, 'sfw', true),

-- Angola
('c0000017-0000-0000-0000-000000000017', 'lucia@moyo.com', 'lucia_dance', 'Lucia Kizomba', 'creator',
 '💃 Kizomba & Semba dancer | Luanda queen | Dance classes available',
 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400',
 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
 'Angola', 'AO', '🇦🇴', 'Dance', 2200, 4500, 10200, 78, 24000, 11.8, true, true, true, 'sfw', true),

-- Zimbabwe
('c0000018-0000-0000-0000-000000000018', 'tino@moyo.com', 'tino_photo', 'Tino Lens', 'creator',
 '📸 Harare photographer | Portraits & landscapes | Capturing Africa''s beauty',
 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
 'Zimbabwe', 'ZW', '🇿🇼', 'Photography', 2800, 3200, 7800, 456, 18000, 9.6, true, true, true, 'sfw', true),

-- Rwanda
('c0000019-0000-0000-0000-000000000019', 'diane@moyo.com', 'diane_wellness', 'Diane Wellness', 'creator',
 '🧘 Kigali yoga instructor | Mindfulness coach | Inner peace advocate',
 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
 'Rwanda', 'RW', '🇷🇼', 'Wellness', 2000, 4100, 9500, 134, 22000, 10.9, true, true, true, 'sfw', true),

-- Botswana
('c0000020-0000-0000-0000-000000000020', 'kagiso@moyo.com', 'kagiso_gaming', 'Kagiso Plays', 'creator',
 '🎮 Gaborone gamer | FIFA & Call of Duty | Streaming weekends',
 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
 'Botswana', 'BW', '🇧🇼', 'Gaming', 1500, 2800, 6400, 89, 15000, 11.2, true, true, true, 'sfw', true);

-- ============================================================================
-- SAMPLE POSTS (3 per creator = 60 total)
-- ============================================================================

INSERT INTO posts (id, creator_id, creator_username, creator_avatar, type, caption, media_urls, thumbnail_url, visibility, price, likes_count, comments_count, views_count, status)
SELECT
    gen_random_uuid(),
    u.id,
    u.username,
    u.avatar,
    'photo',
    CASE (random() * 5)::int
        WHEN 0 THEN 'New content just dropped! 🔥 What do you think?'
        WHEN 1 THEN 'Behind the scenes of today''s shoot 📸'
        WHEN 2 THEN 'Exclusive content for my subscribers! ❤️'
        WHEN 3 THEN 'Working on something special for you all 🎬'
        WHEN 4 THEN 'Thank you for 10K subscribers! 🙏'
        ELSE 'Living my best life today! ✨'
    END,
    ARRAY['https://images.unsplash.com/photo-' || (1500000000 + floor(random() * 50000000))::text || '?w=800'],
    'https://images.unsplash.com/photo-' || (1500000000 + floor(random() * 50000000))::text || '?w=400',
    CASE WHEN random() > 0.5 THEN 'free' ELSE 'subscribers' END,
    CASE WHEN random() > 0.5 THEN 0 ELSE u.subscription_price END,
    floor(random() * 5000 + 100)::int,
    floor(random() * 200 + 10)::int,
    floor(random() * 20000 + 500)::int,
    'published'
FROM users u
WHERE u.role = 'creator'
CROSS JOIN generate_series(1, 3);

-- ============================================================================
-- SAMPLE FAN ACCOUNTS (5 fans for testing)
-- ============================================================================

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

-- ============================================================================
-- SAMPLE SUBSCRIPTIONS
-- ============================================================================

INSERT INTO subscriptions (subscriber_id, creator_id, price, status, started_at, expires_at)
VALUES
-- Sipho subscribes to 3 creators
('f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 2500, 'active', NOW(), NOW() + INTERVAL '30 days'),
('f0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002', 3500, 'active', NOW(), NOW() + INTERVAL '30 days'),
('f0000001-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000004', 1500, 'active', NOW(), NOW() + INTERVAL '30 days'),
-- Amina subscribes to 2 creators
('f0000002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003', 2000, 'active', NOW(), NOW() + INTERVAL '30 days'),
('f0000002-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000005', 1800, 'active', NOW(), NOW() + INTERVAL '30 days');

-- ============================================================================
-- SAMPLE FOLLOWERS
-- ============================================================================

INSERT INTO followers (follower_id, following_id)
VALUES
-- Fans follow creators
('f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001'),
('f0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002'),
('f0000001-0000-0000-0000-000000000001', 'c0000003-0000-0000-0000-000000000003'),
('f0000002-0000-0000-0000-000000000002', 'c0000004-0000-0000-0000-000000000004'),
('f0000002-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000005'),
('f0000003-0000-0000-0000-000000000003', 'c0000006-0000-0000-0000-000000000006'),
('f0000004-0000-0000-0000-000000000004', 'c0000007-0000-0000-0000-000000000007'),
('f0000005-0000-0000-0000-000000000005', 'c0000008-0000-0000-0000-000000000008'),
-- Creators follow each other
('c0000001-0000-0000-0000-000000000001', 'c0000003-0000-0000-0000-000000000003'),
('c0000002-0000-0000-0000-000000000002', 'c0000004-0000-0000-0000-000000000004'),
('c0000005-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001');

-- ============================================================================
-- SAMPLE LIKES
-- ============================================================================

-- Get some post IDs and create likes
INSERT INTO likes (user_id, post_id)
SELECT 
    f.id as user_id,
    p.id as post_id
FROM users f
CROSS JOIN LATERAL (
    SELECT id FROM posts ORDER BY random() LIMIT 5
) p
WHERE f.role = 'fan';

-- ============================================================================
-- SAMPLE CONVERSATIONS & MESSAGES
-- ============================================================================

INSERT INTO conversations (id, participant1_id, participant2_id, last_message, last_message_at, last_message_sender_id)
VALUES
('conv0001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 
 'Love your content! 😍', NOW() - INTERVAL '2 hours', 'f0000001-0000-0000-0000-000000000001'),
('conv0002-0000-0000-0000-000000000002', 'f0000002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003',
 'Thanks for subscribing! 💕', NOW() - INTERVAL '1 day', 'c0000003-0000-0000-0000-000000000003');

INSERT INTO messages (conversation_id, sender_id, recipient_id, type, content)
VALUES
-- Conversation 1
('conv0001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'text', 'Hi Thandi! Love your fashion posts!'),
('conv0001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'text', 'Thanks so much! Means a lot 🙏'),
('conv0001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'text', 'Love your content! 😍'),
-- Conversation 2
('conv0002-0000-0000-0000-000000000002', 'f0000002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003', 'text', 'Just subscribed! Your makeup tutorials are amazing!'),
('conv0002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003', 'f0000002-0000-0000-0000-000000000002', 'text', 'Thanks for subscribing! 💕');

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (user_id, type, from_user_id, from_username, from_avatar, content, action_url)
VALUES
-- Creator receives subscription notification
('c0000001-0000-0000-0000-000000000001', 'subscription', 'f0000001-0000-0000-0000-000000000001', 'sipho_fan', 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=sipho', 'Sipho subscribed to you!', '/profile/sipho_fan'),
-- Creator receives like notification
('c0000003-0000-0000-0000-000000000003', 'like', 'f0000002-0000-0000-0000-000000000002', 'amina_loves',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina', 'Amina liked your post', '/profile/amina_loves'),
-- Creator receives follow notification
('c0000004-0000-0000-0000-000000000004', 'follow', 'f0000002-0000-0000-0000-000000000002', 'amina_loves',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina', 'Amina started following you', '/profile/amina_loves');

-- ============================================================================
-- Done! Your database is now seeded with:
-- - 20 creators from various African countries
-- - 60 posts (3 per creator)
-- - 5 fan accounts
-- - Sample subscriptions, follows, likes, messages, and notifications
-- ============================================================================
