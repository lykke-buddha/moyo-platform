'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MockService } from '@/services/mockService';
import { db } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Post } from '@/types';
import LoginModal from '@/components/modals/LoginModal';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import {
    HeartHandshake, Search, Bell, Plus,
    Check, MoreHorizontal, Lock, Heart, MessageCircle, Banknote, Bookmark, X, Loader2, Eye, Sparkles
} from 'lucide-react';
import { STORIES, CURRENT_USER } from '@/lib/mockData';

const POSTS_PER_PAGE = 10;

export default function Feed() {
    const { isLoggedIn, user, subscribedCreatorIds } = useAuth();

    // UI State
    const [activeTab, setActiveTab] = useState<'subscribed' | 'recommended'>('recommended');
    const [activeStory, setActiveStory] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Data State
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

    // Subscription/Unlock State
    const [subModalData, setSubModalData] = useState<{
        isOpen: boolean;
        creator: string;
        creatorId: string;
        price: string;
        postId?: string
    }>({ isOpen: false, creator: '', creatorId: '', price: '' });

    // Story Timer
    const STORY_DURATION_MS = 25000;
    const [storyProgress, setStoryProgress] = useState(0);

    // Infinite scroll observer
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoadingMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingPosts) {
                loadMorePosts();
            }
        }, { threshold: 0.1 });

        if (node) observerRef.current.observe(node);
    }, [isLoadingMore, hasMore, isLoadingPosts]);

    const transformPost = (p: Record<string, unknown>): Post => ({
        id: p.id as string,
        creatorId: p.creator_id as string,
        creatorUsername: p.creator_username as string,
        creatorAvatar: p.creator_avatar as string || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.creator_username}`,
        creatorCountry: p.creator_country as string || '',
        type: p.type as 'photo' | 'video' | 'album' | 'text' | 'poll',
        mediaUrls: (p.media_urls as string[]) || [],
        thumbnailUrl: p.thumbnail_url as string || '',
        caption: p.caption as string || '',
        visibility: p.visibility as 'free' | 'subscribers' | 'vip' | 'premium',
        price: Number(p.price) || 0,
        likes: Number(p.likes_count) || 0,
        comments: Number(p.comments_count) || 0,
        likedBy: [],
        publishedAt: new Date(p.published_at as string).getTime(),
        createdAt: new Date(p.created_at as string).getTime(),
        // Missing fields with defaults
        isNSFW: (p.is_nsfw as boolean) || false,
        tags: (p.tags as string[]) || [],
        category: (p.category as string) || 'General',
        shares: Number(p.shares) || 0,
        views: Number(p.views) || 0,
        saves: Number(p.saves) || 0,
        status: (p.status as any) || 'published',
        updatedAt: p.updated_at ? new Date(p.updated_at as string).getTime() : new Date(p.created_at as string).getTime(),
        revenue: 0,
        views_from_subscribers: 0,
        conversion_rate: 0
    });

    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        setHasMore(true);
        try {
            if (isSupabaseConfigured()) {
                const supabasePosts = await db.posts.getAll(POSTS_PER_PAGE, 0);
                const transformedPosts = supabasePosts.map(transformPost);
                setPosts(transformedPosts);
                setHasMore(supabasePosts.length === POSTS_PER_PAGE);

                if (user) {
                    const liked = await db.posts.getLikedPostIds(user.id);
                    setLikedPostIds(liked);
                }
            } else {
                const feed = await MockService.getFeed('for_you');
                setPosts(feed);
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const loadMorePosts = async () => {
        if (!isSupabaseConfigured() || isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            const offset = posts.length;
            const newPosts = await db.posts.getAll(POSTS_PER_PAGE, offset);
            const transformedPosts = newPosts.map(transformPost);

            if (transformedPosts.length > 0) {
                setPosts(prev => [...prev, ...transformedPosts]);
                setHasMore(newPosts.length === POSTS_PER_PAGE);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading more posts:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filtered Content
    const displayedPosts = posts.filter(post => {
        if (activeTab === 'recommended') return true;
        if (activeTab === 'subscribed') {
            if (!isLoggedIn || !user) return false;
            return subscribedCreatorIds.includes(post.creatorId) || post.creatorId === user.id;
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
            const isCurrentlyLiked = likedPostIds.includes(id);

            if (isCurrentlyLiked) {
                setLikedPostIds(prev => prev.filter(pId => pId !== id));
                setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
            } else {
                setLikedPostIds(prev => [...prev, id]);
                setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
            }

            // Call service
            try {
                if (isSupabaseConfigured() && user) {
                    await db.posts.like(user.id, id);
                } else {
                    await MockService.toggleLikePost(id);
                }
            } catch (e) {
                // Revert on error
                if (isCurrentlyLiked) {
                    setLikedPostIds(prev => [...prev, id]);
                    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
                } else {
                    setLikedPostIds(prev => prev.filter(pId => pId !== id));
                    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
                }
                console.error(e);
            }
        });
    };

    const toggleBookmark = async (id: string) => {
        requireAuth(async () => {
            await MockService.toggleBookmarkPost(id);
        });
    };

    const initiateSubscribe = (creatorId: string, creatorName: string, price: string = 'R2,500') => {
        requireAuth(() => {
            setSubModalData({ isOpen: true, creator: creatorName, creatorId, price });
        });
    };

    const handleSubscriptionSuccess = () => {
        setSubModalData(prev => ({ ...prev, isOpen: false }));
        // No page reload needed - state updates automatically via context
        fetchPosts(); // Refresh posts to update unlock status
    };

    const handleTip = (creatorName: string) => {
        requireAuth(() => {
            const amount = prompt(`How much would you like to tip ${creatorName}? (e.g., 500)`, "500");
            if (amount) {
                alert(`Tip of R${amount} sent to ${creatorName}! You're amazing.`);
            }
        });
    };

    const handleComment = () => {
        requireAuth(() => alert("Comments section opening soon!"));
    };

    const currentStory = activeStory ? STORIES.find(s => s.id === activeStory) : null;

    const formatCurrency = (amount: number) => {
        return `R${amount.toLocaleString()}`;
    };

    // Check if post is unlocked for current user
    const isPostUnlocked = (post: Post): boolean => {
        if (post.visibility === 'free') return true;
        if (!user) return false;
        if (post.creatorId === user.id) return true;
        return subscribedCreatorIds.includes(post.creatorId);
    };

    return (
        <>
            {/* Mobile Top Header */}
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
                {/* Stories */}
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

                {/* Inline Composer */}
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
                            <Link href="/explore" className="bg-amber-500 text-zinc-950 font-bold py-3 px-8 rounded-full hover:bg-amber-400 transition-colors inline-block">
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
                        const isUnlocked = isPostUnlocked(post);
                        const isLocked = !isUnlocked;
                        const hasLiked = likedPostIds.includes(post.id);

                        return (
                            <article key={post.id} className="border-b border-zinc-800 md:border md:rounded-2xl md:bg-zinc-900/20 md:border-zinc-800/50 mb-6 overflow-hidden relative group">
                                {/* Post Header */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/profile/${post.creatorUsername}`} className="relative cursor-pointer">
                                            <img src={post.creatorAvatar} alt={post.creatorUsername} className="w-10 h-10 rounded-full object-cover" />
                                        </Link>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/profile/${post.creatorUsername}`} className="text-sm font-semibold text-zinc-100 hover:underline cursor-pointer">
                                                    {post.creatorUsername}
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

                                {/* Caption */}
                                <div className="px-4 pb-3">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                        {post.caption}
                                    </p>
                                </div>

                                {/* Content Area - ENHANCED LOCKED STATE */}
                                {isLocked ? (
                                    <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                        {/* Blurred Background Preview */}
                                        {post.thumbnailUrl && (
                                            <img
                                                src={post.thumbnailUrl}
                                                className="w-full h-full object-cover blur-3xl opacity-50 scale-125 absolute inset-0"
                                                alt="Locked content preview"
                                            />
                                        )}

                                        {/* Gradient overlays for depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-transparent" />

                                        {/* Animated sparkles effect */}
                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                            <Sparkles className="absolute top-10 left-10 w-4 h-4 text-amber-500/30 animate-pulse" />
                                            <Sparkles className="absolute top-20 right-16 w-3 h-3 text-amber-500/20 animate-pulse delay-300" />
                                            <Sparkles className="absolute bottom-32 left-20 w-5 h-5 text-amber-500/25 animate-pulse delay-700" />
                                        </div>

                                        {/* Lock Overlay CTA */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                            <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl max-w-[320px] w-full text-center shadow-2xl shadow-black/50">
                                                {/* Pulsing Lock Icon */}
                                                <div className="relative mb-5">
                                                    <div className="absolute inset-0 w-16 h-16 mx-auto bg-amber-500/20 rounded-full blur-xl animate-pulse" />
                                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/30 relative">
                                                        <Lock className="w-7 h-7" strokeWidth={1.5} />
                                                    </div>
                                                </div>

                                                <h4 className="text-zinc-100 font-semibold text-lg mb-2">Exclusive Content</h4>
                                                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                                    Subscribe to <span className="text-amber-500 font-medium">@{post.creatorUsername}</span> to unlock this and all their premium content
                                                </p>

                                                <button
                                                    onClick={() => initiateSubscribe(post.creatorId, post.creatorUsername, formatCurrency(post.price || 2500))}
                                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    Subscribe for {formatCurrency(post.price || 2500)}/mo
                                                </button>

                                                <div className="flex items-center justify-center gap-2 mt-4 text-zinc-500 text-xs">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Get instant access to all content</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full bg-zinc-900 relative">
                                        {post.type === 'photo' && post.mediaUrls[0] && (
                                            <img src={post.mediaUrls[0]} className="w-full h-auto object-cover max-h-[500px]" alt="Post" />
                                        )}
                                    </div>
                                )}

                                {/* Footer / Actions */}
                                <div className={`p-3 md:p-4 ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
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

                {/* Infinite Scroll Trigger */}
                {!isLoadingPosts && hasMore && (
                    <div ref={loadMoreRef} className="py-8 flex justify-center">
                        {isLoadingMore && (
                            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                        )}
                    </div>
                )}

                {/* End of Feed Message */}
                {!hasMore && posts.length > 0 && (
                    <div className="py-8 text-center text-zinc-500 text-sm">
                        You&apos;ve seen all the posts! 🎉
                    </div>
                )}
            </div>

            {/* Story Viewer Overlay */}
            {activeStory && currentStory && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">
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

                    <div className="w-full h-full md:max-w-md md:max-h-[85vh] bg-zinc-900 rounded-lg overflow-hidden relative">
                        <img src={currentStory.storyImage || currentStory.avatar} className="w-full h-full object-cover" alt="Story content" />
                        <div className="absolute top-2 left-2 right-2 flex gap-1 h-1 z-10">
                            <div className="bg-white/30 h-full rounded-full flex-1 overflow-hidden">
                                <div
                                    className="bg-white h-full transition-all duration-100 ease-linear"
                                    style={{ width: `${storyProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

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
                creatorId={subModalData.creatorId}
                price={subModalData.price}
                onSuccess={handleSubscriptionSuccess}
            />
        </>
    );
}
