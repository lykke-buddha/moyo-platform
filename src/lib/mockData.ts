
export const CURRENT_USER = {
    name: 'Chiamaka O.',
    handle: '@chiamaka_vip',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop',
};

export const STORIES = [
    {
        id: '1',
        name: 'Zainab',
        handle: 'zainab_style',
        avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
        hasUnseen: true,
        storyImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=1000&fit=crop'
    },
    {
        id: '2',
        name: 'Kiki__X',
        handle: 'kiki_exclusive',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        hasUnseen: true,
        storyImage: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?w=600&h=1000&fit=crop'
    },
    {
        id: '3',
        name: 'Nia_Love',
        handle: 'nia_daily',
        avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=100&h=100&fit=crop',
        hasUnseen: true,
        storyImage: 'https://images.unsplash.com/photo-1605763240004-7d93b172d7cd?w=600&h=1000&fit=crop'
    },
    {
        id: '4',
        name: 'Amara',
        handle: 'amara_vip',
        avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop',
        hasUnseen: false,
        storyImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=1000&fit=crop'
    },
    {
        id: '5',
        name: 'Sade',
        handle: 'sade_queen',
        avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop',
        hasUnseen: true,
        storyImage: 'https://images.unsplash.com/photo-1583336633292-2ec6496924b2?w=600&h=1000&fit=crop'
    },
];

export const POSTS = [
    {
        id: '1',
        author: {
            name: 'Kiki Xoxo',
            handle: '@kiki_exclusive',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            isVerified: true,
        },
        meta: {
            time: '14m ago',
            location: 'Private Location',
            isPremium: false,
        },
        content: {
            text: 'Just finished shooting my new set 📸 wearing that red piece you all voted for! ✨ \n\nSending the full uncropped gallery to everyone who tips MK 10,000 on this post in the next hour. Check your DMs 💋',
            tags: ['#Exclusive', '#Model', '#VIP'],
            image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop',
        },
        stats: {
            likes: '2.4k',
            comments: 156,
            likedBy: ['Kwame', 'David'],
        },
    },
    {
        id: '2',
        author: {
            name: 'Amara Luxury',
            handle: '@amara_vip',
            avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop',
            isVerified: true,
        },
        meta: {
            time: '2h ago',
            isPremium: true,
        },
        content: {
            text: 'My most requested video is finally here. 🚿💦 \n\nThis 15-minute shower vlog is purely for my VIP subscribers. I get very personal in this one... Unlock to watch immediately.',
            image: 'https://images.unsplash.com/photo-1583336633292-2ec6496924b2?q=80&w=800&auto=format&fit=crop',
        },
        lock: {
            price: 'SUBSCRIBE • MK 5,000',
            oneTimePrice: 'UNLOCK • MK 1,500',
        },
        stats: {
            likes: 890,
            comments: 42,
        },
    },
    {
        id: '3',
        author: {
            name: 'Nia Love',
            handle: '@nia_daily',
            avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=100&h=100&fit=crop',
            isVerified: false,
        },
        meta: {
            time: '4h ago',
            isPremium: false,
        },
        content: {
            text: 'Felt cute, might delete later. 😉 \n\nThe lighting in my bedroom this morning was just perfect. New subscribers get a special welcome video in their inbox!',
            tags: ['#MorningVibes', '#SubscriberLove'],
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
        },
        stats: {
            likes: '1.1k',
            comments: 78,
            likedBy: ['Zainab'],
        },
    },
    {
        id: '4',
        author: {
            name: 'Sade B',
            handle: '@sade_queen',
            avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop',
            isVerified: true,
        },
        meta: {
            time: '6h ago',
            isPremium: true,
        },
        content: {
            text: 'Late night swim... 🌙👙 \n\nWant to see what happened after the camera stopped recording? Join my premium tier.',
            image: 'https://images.unsplash.com/photo-1566453856110-394bf3c98889?q=80&w=800&auto=format&fit=crop',
        },
        lock: {
            price: 'SUBSCRIBE • MK 10,000',
            oneTimePrice: 'UNLOCK • MK 2,500',
        },
        stats: {
            likes: 2100,
            comments: 112,
        },
    },
    // NEW POSTS
    {
        id: '5',
        author: {
            name: 'Zainab Fashion',
            handle: '@zainab_style',
            avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
            isVerified: true,
        },
        meta: {
            time: '1d ago',
            isPremium: true,
        },
        content: {
            text: 'Behind the scenes of my new lingerie collection. 🧵📐 \n\nThese sketches and prototypes are top secret. Only for my inner circle.',
            image: 'https://images.unsplash.com/photo-1550614000-4b9519e02a15?w=800&h=1000&fit=crop',
        },
        lock: {
            price: 'SUBSCRIBE • MK 2,500',
            oneTimePrice: 'UNLOCK • MK 500',
        },
        stats: {
            likes: 540,
            comments: 30,
        },
    },
    {
        id: '6',
        author: {
            name: 'Nia Love',
            handle: '@nia_daily',
            avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=100&h=100&fit=crop',
            isVerified: false,
        },
        meta: {
            time: 'Yesterday',
            isPremium: true,
        },
        content: {
            text: 'Date night outfit reveal... 👗 \n\nHe couldn\'t take his eyes off me. Want to see the full look? Tap to unlock.',
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop',
        },
        lock: {
            price: 'SUBSCRIBE • MK 3,000',
            oneTimePrice: 'UNLOCK • MK 1,000',
        },
        stats: {
            likes: 1200,
            comments: 95,
        },
    },
    {
        id: '7',
        author: {
            name: 'Kiki Xoxo',
            handle: '@kiki_exclusive',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            isVerified: true,
        },
        meta: {
            time: '2d ago',
            isPremium: true,
        },
        content: {
            text: 'Poolside diaries ☀️ \n\nJust me, the sun, and a very tiny bikini. 👙 This set is too hot for the main feed!',
            image: 'https://images.unsplash.com/photo-1566453856110-394bf3c98889?w=800&h=1000&fit=crop',
        },
        lock: {
            price: 'SUBSCRIBE • MK 7,000',
            oneTimePrice: 'UNLOCK • MK 2,000',
        },
        stats: {
            likes: 3100,
            comments: 240,
        },
    },
    {
        id: '8',
        author: {
            name: 'Amara Luxury',
            handle: '@amara_vip',
            avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop',
            isVerified: true,
        },
        meta: {
            time: '3d ago',
            isPremium: false,
        },
        content: {
            text: 'Good morning my loves! ☕️ \n\nWishing you all a productive week ahead. Stay tuned for a big announcement later today!',
            image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop',
        },
        stats: {
            likes: 450,
            comments: 22,
        },
    }
];

export const EXPLORE_POSTS = [
    { id: '1', type: 'image', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop', likes: '1.2k' },
    { id: '2', type: 'video', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=800&fit=crop', likes: '8.5k' },
    { id: '3', type: 'image', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop', likes: '3.4k' },
    { id: '4', type: 'image', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop', likes: '2.1k' },
    { id: '5', type: 'collection', image: 'https://images.unsplash.com/photo-1529139574466-a302d2d3f52c?w=500&h=500&fit=crop', likes: '900' },
    { id: '6', type: 'image', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop', likes: '5.6k' },
    { id: '7', type: 'image', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=800&fit=crop', likes: '12k' },
    { id: '8', type: 'video', image: 'https://images.unsplash.com/photo-1550614000-4b9519e02a15?w=500&h=500&fit=crop', likes: '4.2k' },
    { id: '9', type: 'image', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop', likes: '1.5k' },
    { id: '10', type: 'image', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop', likes: '3.3k' },
    { id: '11', type: 'image', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=500&fit=crop', likes: '7.8k' },
    { id: '12', type: 'collection', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=800&fit=crop', likes: '2.9k' },
    { id: '13', type: 'image', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&h=500&fit=crop', likes: '1.8k' },
    { id: '14', type: 'image', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=500&fit=crop', likes: '4.5k' },
    { id: '15', type: 'video', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop', likes: '6.1k' },
    { id: '16', type: 'image', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop', likes: '3.9k' },
    { id: '17', type: 'image', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=800&fit=crop', likes: '8.2k' },
    { id: '18', type: 'image', image: 'https://images.unsplash.com/photo-1503161001476-880629731295?w=500&h=500&fit=crop', likes: '2.5k' }
];
