'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MockService } from '@/services/mockService';
import { Post } from '@/types';
import LoginModal from '@/components/modals/LoginModal';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import {
    HeartHandshake, Search, Bell, Plus, Image as LucideImage, Video, SlidersHorizontal,
    Check, Star, MoreHorizontal, Lock, Unlock, Heart, MessageCircle, Banknote, Bookmark, X, Loader2
} from 'lucide-react';
import { STORIES, CURRENT_USER } from '@/lib/mockData'; // Keeping STORIES from mockData for now, could migrate too.

export default function Feed() {
    const { isLoggedIn, user } = useAuth();

    // UI State
    const [activeTab, setActiveTab] = useState<'subscribed' | 'recommended'>('recommended');
    const [activeStory, setActiveStory] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Data State
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    // Subscription/Unlock State
    const [subModalData, setSubModalData] = useState<{ isOpen: boolean; creator: string; price: string; postId?: string }>({ isOpen: false, creator: '', price: '' });

    // Local Interaction State (optimistic updates map)
    // We can rely on 'posts' state updates from service, but local maps are faster for UI if needed. 
    // However, MockService returns updated objects, so we can just update 'posts'.

    // Story Timer
    const STORY_DURATION_MS = 25000;
    const [storyProgress, setStoryProgress] = useState(0);

    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
            // Fetch based on active tab
            // For 'subscribed', logic is in MockService if we pass 'following', 
            // but requirements say 'subscribed' tab. 'following' usually entails subscription in some apps, 
            // but here follow != subscribe.
            // Let's just fetch all 'for_you' and filter client side for 'subscribed' for simplicity if service doesn't support 'subscribed' filter yet.
            // Actually, I'll update getFeed to accept 'subscribed' if needed. 
            // MockService has 'following' filter. Let's use 'for_you' and filter here for now.
            const feed = await MockService.getFeed('for_you');
            setPosts(feed);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [activeTab]); // Refetch when tab changes? Or just filter locally? better to fetch once and filter locally for speed in mock.
    // Actually, let's fetch once on mount.

    // Re-run filter when tab changes or user changes (subscriptions loaded)

    // Filtered Content
    const displayedPosts = posts.filter(post => {
        if (activeTab === 'recommended') return true;
        if (activeTab === 'subscribed') {
            if (!isLoggedIn || !user) return false;
            // Check if user is subscribed to author
            // Creator ID is post.creatorId
            return user.subscribedTo.includes(post.creatorId) || post.creatorId === user.id;
        }
        return true;
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeStory) {
            setStoryProgress(0);
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed / STORY_DURATION_MS) * 100;

                if (progress >= 100) {
                    setActiveStory(null);
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

    const toggleLike = async (id: string) => {
        requireAuth(async () => {
            // Optimistic update
            setPosts(prev => prev.map(p => {
                if (p.id === id) {
                    const hasLiked = p.likedBy.includes(user!.id);
                    return {
                        ...p,
                        likes: hasLiked ? p.likes - 1 : p.likes + 1,
                        likedBy: hasLiked ? p.likedBy.filter(u => u !== user!.id) : [...p.likedBy, user!.id]
                    };
                }
                return p;
            }));

            // Call service
            try {
                await MockService.toggleLikePost(id);
            } catch (e) {
                // Revert if failed (todo)
                console.error(e);
            }
        });
    };

    const toggleBookmark = async (id: string) => {
        requireAuth(async () => {
            // Todo: Implement bookmark state
            await MockService.toggleBookmarkPost(id);
            alert("Bookmark toggled (mock)");
        });
    };

    const initiateSubscribe = (creatorName: string, price: string = '₦2,500') => {
        requireAuth(() => {
            // Check if already subscribed
            // We need creatorID to check properly, but for now using name matching or we need to pass creatorId to this function
            // passed creatorName is mostly for display. 
            // We should lookup creator by name? Or better, pass creatorId to this function.
            // Let's assume we can't easily check 'subscribed' without creatorId.
            // But we know who created the post.

            setSubModalData({ isOpen: true, creator: creatorName, price });
        });
    };

    const initiateUnlock = (postId: string, price: string, creatorName: string) => {
        requireAuth(() => {
            setSubModalData({ isOpen: true, creator: creatorName, price, postId });
        });
    };

    const handleSubscriptionSuccess = () => {
        setSubModalData(prev => ({ ...prev, isOpen: false }));
        fetchPosts(); // Refresh to see unlocked content? Or just update user.
        // Actually we need to reload user to update subscriptions list
        window.location.reload(); // Simple brute force update for mock
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
                    <Link href="/explore" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800/50 text-zinc-400">
                        <Search className="w-5 h-5" strokeWidth={1.5} />
                    </Link>
                    <Link href="/notifications" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800/50 text-zinc-400">
                        <Bell className="w-5 h-5" strokeWidth={1.5} />
                    </Link>
                </div>
            </header>

            <div className="max-w-[640px] mx-auto w-full pb-24 md:pb-10">
                {/* Stories - Only show if logged in */}
                {isLoggedIn && (
                    <div className="pt-4 md:pt-6 px-4 md:px-0">
                        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2">
                            {/* My Story */}
                            <div className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group" onClick={() => alert("Add to your story!")}>
                                <div className="w-[64px] h-[64px] md:w-[70px] md:h-[70px] rounded-full border border-dashed border-zinc-600 p-1 group-hover:border-zinc-400 transition-colors relative">
                                    <img src={user?.avatar || CURRENT_USER.avatar} alt="My Story" className="w-full h-full rounded-full object-cover opacity-60" />
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
                                <img src={user?.avatar || CURRENT_USER.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <Link href="/create" className="block w-full text-left bg-transparent text-sm text-zinc-500 cursor-text py-2.5">
                                        Create a new post...
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feed Tabs */}
                <div className="flex items-center justify-between px-6 md:px-0 mb-4 border-b border-zinc-800 sticky top-14 md:top-0 bg-zinc-950/95 backdrop-blur z-20">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('recommended')}
                            className={`py-3 text-sm font-medium transition-colors ${activeTab === 'recommended' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Recommended
                        </button>
                        <button
                            onClick={() => setActiveTab('subscribed')}
                            className={`py-3 text-sm font-medium transition-colors ${activeTab === 'subscribed' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Subscribed
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
                ) : displayedPosts.length === 0 ? (
                    activeTab === 'subscribed' ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-zinc-100 font-bold text-lg mb-2">No subscriptions yet</h3>
                            <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">Subscribe to creators to see their exclusive content here.</p>
                            <Link href="/explore" onClick={() => setActiveTab('recommended')} className="bg-amber-500 text-zinc-950 font-bold py-3 px-8 rounded-full hover:bg-amber-400 transition-colors inline-block">
                                Find Creators
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-zinc-500">
                            <p>No posts found.</p>
                        </div>
                    )
                ) : (
                    displayedPosts.map(post => {
                        const isUnlocked = post.visibility === 'free' || (user && user.subscribedTo.includes(post.creatorId)) || post.creatorId === user?.id; // Simplified unlock logic
                        const isLocked = !isUnlocked;
                        const hasLiked = user ? post.likedBy.includes(user.id) : false;

                        return (
                            <article key={post.id} className="border-b border-zinc-800 md:border md:rounded-2xl md:bg-zinc-900/20 md:border-zinc-800/50 mb-6 overflow-hidden relative group">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/profile/${post.creatorUsername}`} className="relative cursor-pointer">
                                            <img src={post.creatorAvatar} alt={post.creatorUsername} className="w-10 h-10 rounded-full object-cover" />
                                            {/* Verification badge logic if available in post data */}
                                        </Link>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/profile/${post.creatorUsername}`} className="text-sm font-semibold text-zinc-100 hover:underline cursor-pointer">
                                                    {post.creatorUsername} {/* Should use displayName but Post has username/avatar cached */}
                                                </Link>
                                                <span className="text-zinc-500 text-xs">@{post.creatorUsername}</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500">
                                                {new Date(post.publishedAt).toLocaleDateString()} {post.visibility !== 'free' && '• Subscribers only'}
                                            </p>
                                        </div>
                                    </div>

                                    <button className="text-zinc-500 hover:text-zinc-300 p-2 hover:bg-zinc-800/50 rounded-full transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="px-4 pb-3">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {post.caption}
                                    </p>
                                </div>

                                {/* Content Area */}
                                {isLocked ? (
                                    <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                        {post.thumbnailUrl && (
                                            <img src={post.thumbnailUrl} className="w-full h-full object-cover blur-2xl opacity-40 scale-110" alt="Locked content" />
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                                            <div className="bg-zinc-950/60 border border-white/10 p-6 rounded-2xl max-w-[280px] w-full text-center shadow-2xl backdrop-blur-xl">
                                                <div className="w-12 h-12 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 border border-zinc-700 shadow-inner">
                                                    <Lock className="w-[22px] h-[22px]" strokeWidth={2} />
                                                </div>
                                                <h4 className="text-zinc-100 font-medium mb-1.5">Unlock this post</h4>
                                                <p className="text-zinc-400 text-xs mb-5 leading-relaxed">Subscribe to {post.creatorUsername} to access this content.</p>

                                                <button
                                                    onClick={() => initiateSubscribe(post.creatorUsername, formatCurrency(post.price || 2500))} // Fallback price
                                                    className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2.5 rounded-lg text-xs transition-all mb-2.5 shadow hover:shadow-lg"
                                                >
                                                    Subscribe
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full bg-zinc-900 relative">
                                        {post.type === 'photo' && post.mediaUrls[0] && (
                                            <img src={post.mediaUrls[0]} className="w-full h-auto object-cover max-h-[500px]" alt="Post" />
                                        )}
                                        {/* Handle other types */}
                                    </div>
                                )}

                                {/* Footer / Actions */}
                                <div className={`p-3 md:p-4 ${isLocked ? 'border-t border-zinc-800/50 flex justify-between items-center opacity-40 select-none' : ''}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => toggleLike(post.id)}
                                                className={`flex items-center gap-1.5 p-2 rounded-lg transition-all group ${hasLiked ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10'}`}
                                                disabled={isLocked}
                                            >
                                                <Heart className={`w-[22px] h-[22px] group-hover:scale-110 transition-transform ${hasLiked ? 'fill-current' : ''}`} strokeWidth={1.5} />
                                                <span className="text-xs font-medium">{post.likes}</span>
                                            </button>
                                            <button
                                                onClick={handleComment}
                                                className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all group"
                                                disabled={isLocked}
                                            >
                                                <MessageCircle className="w-[22px] h-[22px] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                                <span className="text-xs font-medium">{post.comments}</span>
                                            </button>
                                            <button
                                                onClick={() => handleTip(post.creatorUsername)}
                                                className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all group"
                                                disabled={isLocked}
                                            >
                                                <Banknote className="w-[22px] h-[22px] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                                <span className="text-xs font-medium">Tip</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => toggleBookmark(post.id)}
                                            className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10`}
                                            disabled={isLocked}
                                        >
                                            <Bookmark className={`w-[22px] h-[22px]`} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>

            {/* Story Viewer Overlay (Existing logic kept) */}
            {activeStory && currentStory && (
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
            )}

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
