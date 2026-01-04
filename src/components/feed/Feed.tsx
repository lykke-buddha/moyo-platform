'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORIES, CURRENT_USER } from '@/lib/mockData'; // Keep STORIES mock for now
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/modals/LoginModal';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import { supabase } from '@/lib/supabase';
import {
    HeartHandshake, Search, Bell, Plus, Image as LucideImage, Video, SlidersHorizontal,
    Check, Star, MoreHorizontal, Lock, Unlock, Heart, MessageCircle, Banknote, Bookmark, X, Loader2
} from 'lucide-react';

export default function Feed() {
    const { isLoggedIn, user } = useAuth();

    // UI State
    const [activeTab, setActiveTab] = useState<'subscribed' | 'recommended'>('recommended');
    const [activeStory, setActiveStory] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Data State
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    // Subscription/Unlock State
    const [subModalData, setSubModalData] = useState<{ isOpen: boolean; creator: string; price: string; postId?: string }>({ isOpen: false, creator: '', price: '' });

    // Content State
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
    const [unlockedPosts, setUnlockedPosts] = useState<Record<string, boolean>>({});
    const [subscribedCreators, setSubscribedCreators] = useState<Record<string, boolean>>({});

    // Story Timer
    const STORY_DURATION_MS = 25000; // 25 seconds
    const [storyProgress, setStoryProgress] = useState(0);

    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    id,
                    content,
                    image_url,
                    created_at,
                    is_premium,
                    price,
                    profiles (
                        full_name,
                        username,
                        avatar_url,
                        is_verified
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeStory) {
            setStoryProgress(0);
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed / STORY_DURATION_MS) * 100;

                if (progress >= 100) {
                    setActiveStory(null); // Close story after 25s
                    clearInterval(interval);
                } else {
                    setStoryProgress(progress);
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [activeStory]);

    const requireAuth = (action: () => void) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else {
            action();
        }
    };

    const toggleLike = (id: string) => {
        requireAuth(() => setLikedPosts(prev => ({ ...prev, [id]: !prev[id] })));
    };

    const toggleBookmark = (id: string) => {
        requireAuth(() => setBookmarkedPosts(prev => ({ ...prev, [id]: !prev[id] })));
    };

    const initiateSubscribe = (creatorName: string, price: string = '₦2,500') => {
        requireAuth(() => {
            if (subscribedCreators[creatorName]) {
                alert(`You are already subscribed to ${creatorName}!`);
                return;
            }
            // Explicitly ensure isOpen is true
            setSubModalData({ isOpen: true, creator: creatorName, price });
        });
    };

    const initiateUnlock = (postId: string, price: string, creatorName: string) => {
        requireAuth(() => {
            setSubModalData({ isOpen: true, creator: creatorName, price, postId });
        });
    };

    const handleSubscriptionSuccess = () => {
        if (subModalData.postId) {
            setUnlockedPosts(prev => ({ ...prev, [subModalData.postId!]: true }));
        } else {
            setSubscribedCreators(prev => ({ ...prev, [subModalData.creator]: true }));
        }
        // Fix: Ensure we close the modal properly
        setSubModalData(prev => ({ ...prev, isOpen: false }));
    };

    const handleTip = (creatorName: string) => {
        requireAuth(() => {
            const amount = prompt(`How much would you like to tip ${creatorName}? (e.g., 500)`, "500");
            if (amount) {
                alert(`Tip of ₦${amount} sent to ${creatorName}! You're amazing.`);
            }
        });
    };

    const handleComment = () => {
        requireAuth(() => alert("Comments section opening soon!"));
    };

    const currentStory = activeStory ? STORIES.find(s => s.id === activeStory) : null;

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    return (
        <>
            {/* Mobile Top Header (Visible only on mobile) */}
            <header className="md:hidden sticky top-0 z-30 glass border-b border-zinc-800/50 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white">
                        <HeartHandshake className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-zinc-100">MOYO</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => alert("Search functionality coming soon!")}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800/50 text-zinc-400"
                    >
                        <Search className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    <button
                        onClick={() => alert("No new notifications")}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800/50 text-zinc-400"
                    >
                        <Bell className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            <div className="max-w-[640px] mx-auto w-full pb-24 md:pb-10">
                {/* Stories */}
                {/* Stories - Only show if logged in */}
                {isLoggedIn && (
                    <div className="pt-4 md:pt-6 px-4 md:px-0">
                        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2">
                            {/* My Story */}
                            <div className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group" onClick={() => alert("Add to your story!")}>
                                <div className="w-[64px] h-[64px] md:w-[70px] md:h-[70px] rounded-full border border-dashed border-zinc-600 p-1 group-hover:border-zinc-400 transition-colors relative">
                                    <img src={user?.user_metadata?.avatar_url || CURRENT_USER.avatar} alt="My Story" className="w-full h-full rounded-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                        <Plus className="text-white drop-shadow-md w-6 h-6" strokeWidth={2} />
                                    </div>
                                </div>
                                <span className="text-[11px] text-zinc-400 font-medium truncate w-full text-center">Add Story</span>
                            </div>

                            {/* Story Items */}
                            {STORIES.map((story) => (
                                <div key={story.id} onClick={() => setActiveStory(story.id)} className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group">
                                    <div className={`w-[64px] h-[64px] md:w-[70px] md:h-[70px] rounded-full ${story.hasUnseen ? 'bg-gradient-to-tr from-amber-500 to-orange-600' : 'bg-zinc-800'} p-[2px]`}>
                                        <div className="w-full h-full rounded-full border-2 border-zinc-950 overflow-hidden bg-zinc-800">
                                            <img src={story.avatar} alt={story.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </div>
                                    <span className={`text-[11px] truncate w-full text-center ${!story.hasUnseen ? 'text-zinc-500' : 'text-zinc-300'}`}>{story.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Inline Composer (Only if logged in) */}
                {isLoggedIn && (
                    <div className="hidden md:block px-4 mb-8 mt-4">
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 focus-within:ring-1 focus-within:ring-amber-500/50 transition-all focus-within:bg-zinc-900/60">
                            <div className="flex gap-4">
                                <img src={user?.user_metadata?.avatar_url || CURRENT_USER.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <Link href="/create" className="block w-full text-left bg-transparent text-sm text-zinc-500 cursor-text py-2.5">
                                        Create a new post...
                                    </Link>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                                        <div className="flex gap-2 text-zinc-400">
                                            <button className="hover:text-amber-500 p-2 hover:bg-zinc-800 rounded-lg transition-all">
                                                <LucideImage className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                            </button>
                                            <button className="hover:text-amber-500 p-2 hover:bg-zinc-800 rounded-lg transition-all">
                                                <Video className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                        <Link
                                            href="/create"
                                            className="bg-zinc-100 text-zinc-950 px-5 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors shadow-lg shadow-white/5"
                                        >
                                            Post
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feed Tabs */}
                <div className="flex items-center justify-between px-6 md:px-0 mb-4 border-b border-zinc-800 sticky top-14 md:top-0 bg-zinc-950/95 backdrop-blur z-20">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('subscribed')}
                            className={`py-3 text-sm font-medium transition-colors ${activeTab === 'subscribed' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Subscribed
                        </button>
                        <button
                            onClick={() => setActiveTab('recommended')}
                            className={`py-3 text-sm font-medium transition-colors ${activeTab === 'recommended' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Recommended
                        </button>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Posts Feed */}
                {isLoadingPosts ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">
                        <p>No posts yet. Be the first to post!</p>
                        <Link href="/create" className="text-amber-500 hover:underline mt-2 inline-block">Create Post</Link>
                    </div>
                ) : (
                    posts.map(post => {
                        const profile = post.profiles; // Joined data
                        const authorName = profile?.full_name || 'Unknown User';
                        const authorHandle = profile?.username || 'user';
                        const authorAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop';
                        const isVerified = profile?.is_verified;

                        const isUnlocked = unlockedPosts[post.id] || subscribedCreators[authorName] || post.user_id === user?.id; // Authour can always see
                        const isLocked = post.is_premium && !isUnlocked;

                        return (
                            <article key={post.id} className="border-b border-zinc-800 md:border md:rounded-2xl md:bg-zinc-900/20 md:border-zinc-800/50 mb-6 overflow-hidden relative group">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/profile/${authorHandle}`} className="relative cursor-pointer">
                                            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
                                            {isVerified && (
                                                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-zinc-950 rounded-full p-0.5 border-2 border-zinc-950">
                                                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                                </div>
                                            )}
                                            {post.is_premium && (
                                                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-zinc-950 rounded-full p-0.5 border-2 border-zinc-950">
                                                    <Star className="w-2.5 h-2.5" fill="currentColor" />
                                                </div>
                                            )}
                                        </Link>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/profile/${authorHandle}`} className="text-sm font-semibold text-zinc-100 hover:underline cursor-pointer">
                                                    {authorName}
                                                </Link>
                                                <span className="text-zinc-500 text-xs">@{authorHandle}</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500">
                                                {new Date(post.created_at).toLocaleDateString()} {post.is_premium && '• Subscribers only'}
                                            </p>
                                        </div>
                                    </div>

                                    {post.is_premium ? (
                                        <div className="flex items-center gap-2">
                                            <span className="bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-zinc-700">Premium</span>
                                            <button className="text-zinc-500 hover:text-zinc-300">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="text-zinc-500 hover:text-zinc-300 p-2 hover:bg-zinc-800/50 rounded-full transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="px-4 pb-3">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {post.content}
                                    </p>
                                </div>

                                {/* Content Area (Image / Locked Overlay) */}
                                {isLocked ? (
                                    <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                        {post.image_url && (
                                            <img src={post.image_url} className="w-full h-full object-cover blur-2xl opacity-40 scale-110" alt="Locked content logic" />
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                                            <div className="bg-zinc-950/60 border border-white/10 p-6 rounded-2xl max-w-[280px] w-full text-center shadow-2xl backdrop-blur-xl">
                                                <div className="w-12 h-12 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 border border-zinc-700 shadow-inner">
                                                    <Lock className="w-[22px] h-[22px]" strokeWidth={2} />
                                                </div>
                                                <h4 className="text-zinc-100 font-medium mb-1.5">Unlock this post</h4>
                                                <p className="text-zinc-400 text-xs mb-5 leading-relaxed">Subscribe to {authorName} to access this video and her full archive.</p>

                                                <button
                                                    onClick={() => initiateSubscribe(authorName, formatCurrency(post.price))}
                                                    className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2.5 rounded-lg text-xs transition-all mb-2.5 shadow hover:shadow-lg"
                                                >
                                                    Subscribe • {formatCurrency(post.price || 2500)}
                                                </button>
                                                <button
                                                    onClick={() => initiateUnlock(post.id, '₦500', authorName)}
                                                    className="w-full border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 font-medium py-2.5 rounded-lg text-xs transition-all"
                                                >
                                                    Unlock • ₦500
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    post.image_url ? (
                                        <div className="w-full bg-zinc-900 relative">
                                            <img src={post.image_url} className="w-full h-auto object-cover max-h-[500px]" alt="Post" />
                                            {/* Show 'Unlocked' badge if it was premium */}
                                            {post.is_premium && (
                                                <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                                                    <Unlock className="w-3.5 h-3.5" />
                                                    Unlocked
                                                </div>
                                            )}
                                        </div>
                                    ) : null
                                )}

                                {/* Footer / Actions */}
                                <div className={`p-3 md:p-4 ${isLocked ? 'border-t border-zinc-800/50 flex justify-between items-center opacity-40 select-none' : ''}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => toggleLike(post.id)}
                                                className={`flex items-center gap-1.5 p-2 rounded-lg transition-all group ${likedPosts[post.id] ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10'}`}
                                                disabled={isLocked}
                                            >
                                                <Heart className={`w-[22px] h-[22px] group-hover:scale-110 transition-transform ${likedPosts[post.id] ? 'fill-current' : ''}`} strokeWidth={1.5} />
                                                <span className="text-xs font-medium">{likedPosts[post.id] ? '1' : '0'}</span>
                                            </button>
                                            <button
                                                onClick={handleComment}
                                                className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all group"
                                                disabled={isLocked}
                                            >
                                                <MessageCircle className="w-[22px] h-[22px] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                                <span className="text-xs font-medium">0</span>
                                            </button>
                                            <button
                                                onClick={() => handleTip(authorName)}
                                                className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all group"
                                                disabled={isLocked}
                                            >
                                                <Banknote className="w-[22px] h-[22px] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                                <span className="text-xs font-medium">Tip</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => toggleBookmark(post.id)}
                                            className={`p-2 rounded-lg transition-colors ${bookmarkedPosts[post.id] ? 'text-amber-500 hover:bg-amber-500/10' : 'text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10'}`}
                                            disabled={isLocked}
                                        >
                                            <Bookmark className={`w-[22px] h-[22px] ${bookmarkedPosts[post.id] ? 'fill-current' : ''}`} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}

                {/* Footer Links (Mobile only) */}
                <div className="md:hidden py-6 text-center space-y-2 border-t border-zinc-900 mt-8">
                    <div className="flex justify-center gap-4 text-xs text-zinc-600">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Help</a>
                    </div>
                    <p className="text-zinc-700 text-[10px]">© 2024 Moyo. Made for Africa.</p>
                </div>
            </div >

            {/* Story Viewer Overlay */}
            {
                activeStory && currentStory && (
                    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                            <div className="flex items-center gap-3">
                                <img src={currentStory.avatar} className="w-8 h-8 rounded-full border border-white/50" alt={currentStory.name} />
                                <span className="text-white font-semibold text-sm">{currentStory.name}</span>
                                <span className="text-white/60 text-xs">25s</span>
                            </div>
                            <div className="flex items-center gap-4 p-2 relative z-50">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveStory(null); }}
                                    className="text-white hover:text-amber-500 bg-white/10 backdrop-blur-md p-2 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Story Content */}
                        <div className="w-full h-full md:max-w-md md:max-h-[85vh] bg-zinc-900 rounded-lg overflow-hidden relative">
                            <img src={currentStory.storyImage || currentStory.avatar} className="w-full h-full object-cover" alt="Story content" />
                            {/* Progress Bar with Timer */}
                            <div className="absolute top-2 left-2 right-2 flex gap-1 h-1 z-10">
                                <div className="bg-white/30 h-full rounded-full flex-1 overflow-hidden">
                                    <div
                                        className="bg-white h-full transition-all duration-100 ease-linear"
                                        style={{ width: `${storyProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                            <div className="flex gap-4 max-w-sm mx-auto w-full">
                                <input type="text" placeholder="Send message" className="bg-transparent border border-white/30 rounded-full px-4 py-3 text-white placeholder-white/70 w-full focus:outline-none focus:border-white" />
                                <button className="text-white">
                                    <Heart className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <SubscriptionModal
                isOpen={subModalData.isOpen}
                onClose={() => setSubModalData(prev => ({ ...prev, isOpen: false }))}
                creatorName={subModalData.creator}
                price={subModalData.price}
                onSuccess={handleSubscriptionSuccess}
            />
        </>
    );
}
