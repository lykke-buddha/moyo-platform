'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Share2, MapPin, Link as LinkIcon, Lock, MoreHorizontal, ArrowLeft, Check, ImageOff, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MockService } from '@/services/mockService';
import { db } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { User, Post, UserRole } from '@/types';
import LoginModal from '@/components/modals/LoginModal';
import SubscriptionModal from '@/components/modals/SubscriptionModal';

// Utility to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const { user: currentUser, isLoggedIn } = useAuth();

    // Clean handle
    const rawHandle = params?.handle;
    const handle = (Array.isArray(rawHandle) ? rawHandle[0] : rawHandle) || '';
    const username = decodeURIComponent(handle).replace('@', '').toLowerCase();

    // State
    const [profile, setProfile] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'shop'>('posts');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [subModalOpen, setSubModalOpen] = useState(false);

    // Fetch Data
    useEffect(() => {
        async function loadProfile() {
            if (!username) return;
            setIsLoading(true);
            try {
                if (isSupabaseConfigured()) {
                    // Fetch real data
                    const dbUser = await db.users.getByUsername(username);
                    if (dbUser) {
                        // Transform DB user to Frontend User
                        const user: User = {
                            id: dbUser.id,
                            email: dbUser.email,
                            username: dbUser.username,
                            displayName: dbUser.display_name || dbUser.username,
                            role: dbUser.role as UserRole,
                            accountType: dbUser.role as 'creator' | 'fan',
                            age: dbUser.age || 0,
                            country: dbUser.country || '',
                            countryFlag: dbUser.country_flag || '',
                            category: dbUser.category || '',
                            bio: dbUser.bio || '',
                            avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}`,
                            coverImage: dbUser.cover_image || '',
                            followersCount: dbUser.followers_count || 0,
                            followingCount: dbUser.following_count || 0,
                            subscribersCount: dbUser.subscribers_count || 0,
                            subscriptionPrice: dbUser.subscription_price || 0,
                            totalPosts: dbUser.total_posts || 0,
                            totalLikes: dbUser.total_likes || 0,
                            totalViews: dbUser.total_views || 0,
                            totalEarnings: dbUser.total_earnings || 0,
                            isVerified: dbUser.is_verified || false,
                            dateOfBirth: { day: 1, month: 1, year: 2000 },
                            followers: [],
                            following: [],
                            subscribers: [],
                            subscribedTo: [],
                            subscriptionTiers: [],
                            canPost: dbUser.role === 'creator',
                            isOnline: false,
                            lastSeen: Date.now(),
                            createdAt: new Date(dbUser.created_at).getTime(),
                            isLoggedIn: false,

                            // Missing fields added
                            ageVerified: dbUser.age_verified || false,
                            countryCode: dbUser.country_code || '',
                            verificationStatus: dbUser.verification_status || 'pending',
                            engagementRate: dbUser.engagement_rate || 0,
                            allowExplicitContent: dbUser.allow_explicit_content || false,
                            messagingEnabled: dbUser.messaging_enabled || false,
                            messagingPrice: dbUser.messaging_price || 0,
                            autoAcceptMessages: dbUser.auto_accept_messages || false,
                            creatorSince: dbUser.creator_since ? new Date(dbUser.creator_since).getTime() : undefined,
                            contentRating: dbUser.content_rating || 'sfw'
                        };
                        setProfile(user);

                        // Fetch Posts
                        const dbPosts = await db.posts.getByCreator(user.id);
                        const transformedPosts: Post[] = dbPosts.map((p: any) => ({
                            id: p.id,
                            creatorId: p.creator_id,
                            creatorUsername: user.username,
                            creatorAvatar: user.avatar,
                            creatorCountry: user.country,
                            type: p.type,
                            mediaUrls: p.media_urls || [],
                            thumbnailUrl: p.thumbnail_url || '',
                            caption: p.caption || '',
                            visibility: p.visibility,
                            price: p.price || 0,
                            likes: p.likes_count || 0,
                            comments: p.comments_count || 0,
                            shares: p.shares_count || 0,
                            views: p.views_count || 0,
                            saves: 0,
                            likedBy: [],
                            publishedAt: new Date(p.published_at || p.created_at).getTime(),
                            createdAt: new Date(p.created_at).getTime(),
                            isNSFW: false,
                            tags: [],
                            category: '',
                            status: p.status,
                            updatedAt: new Date(p.updated_at || p.created_at).getTime(),
                            revenue: 0,
                            views_from_subscribers: 0,
                            conversion_rate: 0
                        }));
                        setPosts(transformedPosts);
                    } else {
                        setProfile(null);
                    }
                } else {
                    // Fallback to Mock
                    const user = await MockService.getUserByUsername(username);
                    if (user) {
                        setProfile(user);
                        const userPosts = await MockService.getPostsByUserId(user.id);
                        setPosts(userPosts);
                    } else {
                        setProfile(null);
                    }
                }
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [username, currentUser?.id]);

    // Interaction Handlers
    const isOwner = currentUser?.username.toLowerCase() === username;
    // For real DB, we need to check isFollowing async or rely on AuthContext if it has full list
    // AuthContext usually has 'following' array. If extensive list, might need async check.
    // For now, assuming AuthContext 'following' is sufficient or we use db.followers.isFollowing
    const isSubscribed = (profile && currentUser?.subscribedTo?.includes(profile.id)) || false;
    const isFollowing = (profile && currentUser?.following?.includes(profile.id)) || false;

    const handleSubscribe = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        setSubModalOpen(true);
    };

    const handleFollow = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        if (!profile || !currentUser) return;

        try {
            if (isSupabaseConfigured()) {
                if (isFollowing) {
                    await db.followers.unfollow(currentUser.id, profile.id);
                } else {
                    await db.followers.follow(currentUser.id, profile.id);
                }
                // Refresh to update UI - ideally update context/swr
                window.location.reload();
            } else {
                await MockService.toggleFollow(profile.id);
                window.location.reload();
            }
        } catch (e) {
            console.error('Follow error:', e);
        }
    };

    const handleSubscriptionSuccess = () => {
        setSubModalOpen(false);
        window.location.reload();
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-amber-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-400 p-4 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">User not found</h2>
                <p className="max-w-xs mb-6">The user @{username} does not exist.</p>
                <Link href="/" className="text-amber-500 hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="flex bg-zinc-950 min-h-screen">
            <main className="flex-1 h-full overflow-y-auto no-scrollbar relative w-full bg-zinc-950">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px] md:hidden pointer-events-none">
                    <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto cursor-pointer hover:bg-black/60 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2 pointer-events-auto">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="max-w-[700px] mx-auto w-full pb-24 md:pb-10">
                    {/* Cover & Header */}
                    <div className="relative">
                        <div className="h-32 md:h-56 w-full relative overflow-hidden md:rounded-b-none bg-zinc-900">
                            {profile.coverImage && (
                                <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
                        </div>

                        <div className="px-5 md:px-8 relative -mt-12 md:-mt-16 flex flex-col items-start leading-none">
                            <div className="flex justify-between items-end w-full mb-4">
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-zinc-950 relative">
                                        <Image src={profile.avatar} alt="Avatar" fill className="rounded-full object-cover border-2 border-zinc-800" />
                                    </div>
                                    {profile.isVerified && (
                                        <div className="absolute bottom-2 right-2 bg-amber-500 text-zinc-950 rounded-full p-1 border-2 border-zinc-950">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="hidden md:flex items-center gap-2 mb-2">
                                    {isOwner ? (
                                        <Link href="/settings" className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2.5 rounded-full text-sm font-semibold transition-all">
                                            Edit Profile
                                        </Link>
                                    ) : (
                                        <>
                                            <button className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleFollow}
                                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${isFollowing ? 'border-zinc-700 text-zinc-300' : 'bg-zinc-800 text-white border-transparent'}`}
                                            >
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                            <button
                                                onClick={handleSubscribe} // Use handler
                                                disabled={isSubscribed || profile.role !== 'creator'}
                                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-white/5 flex items-center gap-2 ${isSubscribed ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 hover:bg-white text-zinc-950'}`}
                                            >
                                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">{profile.displayName}</h1>
                                    {profile.verificationStatus === 'verified' && <span className="bg-amber-500/10 text-amber-500 text-[10px] font-medium px-1.5 py-0.5 rounded border border-amber-500/20">Official</span>}
                                </div>
                                <p className="text-zinc-500 text-sm mb-3">@{profile.username}</p>

                                <div className="prose prose-invert max-w-none mb-4">
                                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{profile.bio || "No bio available."}</p>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-zinc-500 mb-6">
                                    {(profile.country || profile.city) && (
                                        <div className="flex items-center text-zinc-400 mr-4">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {profile.countryFlag && <span className="mr-1.5 text-base">{profile.countryFlag}</span>}
                                            <span>
                                                {profile.city ? `${profile.city}, ` : ''}{profile.country}
                                            </span>
                                        </div>
                                    )}
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <a href="#" className="text-amber-500 hover:underline">moyo.africa/{profile.username}</a>
                                </div>

                                <div className="flex items-center gap-6 border-y border-zinc-800 py-3 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">{profile.totalPosts}</span>
                                        <span className="text-xs text-zinc-500">Posts</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">{profile.totalLikes || 0}</span>
                                        <span className="text-xs text-zinc-500">Likes</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-zinc-200">{profile.subscribersCount || 0}</span>
                                        <span className="text-xs text-zinc-500">Subscribers</span>
                                    </div>
                                </div>

                                {/* Mobile Actions */}
                                <div className="flex md:hidden items-center gap-2 w-full mb-6">
                                    {isOwner ? (
                                        <Link href="/settings" className="flex-1 bg-zinc-100 text-zinc-950 py-2.5 rounded-lg text-sm font-semibold text-center">Edit</Link>
                                    ) : (
                                        <>
                                            <button onClick={handleSubscribe} disabled={isSubscribed} className={`flex-1 ${isSubscribed ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-950'} py-2.5 rounded-lg text-sm font-semibold`}>
                                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                            </button>
                                            <button onClick={handleFollow} className="flex-1 bg-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium border border-zinc-700">
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="sticky top-14 md:top-0 bg-zinc-950/95 backdrop-blur z-20 border-b border-zinc-800 mb-4 px-4 md:px-8">
                        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                            <button className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'posts' ? 'text-zinc-100 border-amber-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`} onClick={() => setActiveTab('posts')}>
                                Posts <span className="ml-1.5 text-xs text-zinc-500 font-normal">{posts.length}</span>
                            </button>
                            <button className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'media' ? 'text-zinc-100 border-amber-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`} onClick={() => setActiveTab('media')}>
                                Media
                            </button>
                        </div>
                    </div>

                    {/* Posts Grid/List */}
                    <div className="md:px-4 space-y-4">
                        {posts.length > 0 ? (
                            posts.map(post => {
                                const isLocked = post.visibility === 'subscribers' && !isSubscribed && !isOwner;

                                return (
                                    <article key={post.id} className="border-b border-zinc-800 md:border md:rounded-2xl md:bg-zinc-900/20 md:border-zinc-800/50 overflow-hidden relative">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-9 h-9">
                                                    <Image src={profile.avatar} fill className="rounded-full object-cover" alt="Avatar" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-zinc-100">{profile.displayName}</h3>
                                                    <p className="text-[11px] text-zinc-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {isLocked && <Lock className="w-4 h-4 text-zinc-500" />}
                                        </div>

                                        <div className="px-4 pb-3">
                                            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{post.caption}</p>
                                        </div>

                                        {(post.mediaUrls.length > 0 || post.thumbnailUrl) && (
                                            <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                                <Image
                                                    src={isLocked && post.thumbnailUrl ? post.thumbnailUrl : post.mediaUrls[0]}
                                                    fill
                                                    className={`object-cover ${isLocked ? 'blur-2xl opacity-40' : ''}`}
                                                    alt="Content"
                                                />
                                                {isLocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                                                        <div className="bg-zinc-950/60 border border-white/10 p-6 rounded-2xl max-w-[280px] w-full text-center shadow-2xl backdrop-blur-xl">
                                                            <Lock className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                                                            <h4 className="text-zinc-100 font-medium mb-1">Unlock this post</h4>
                                                            <p className="text-zinc-500 text-xs mb-4">Subscribe to see exclusive content.</p>
                                                            <button onClick={handleSubscribe} className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2 rounded-lg text-xs transition-all">
                                                                Subscribe • {formatCurrency(profile.subscriptionPrice || 2500)}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </article>
                                );
                            })
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                                    <ImageOff className="w-8 h-8" />
                                </div>
                                <h3 className="text-zinc-300 font-medium mb-2">No posts yet</h3>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            {profile && (
                <SubscriptionModal
                    isOpen={subModalOpen}
                    onClose={() => setSubModalOpen(false)}
                    creatorName={profile.displayName}
                    creatorId={profile.id}
                    price={formatCurrency(profile.subscriptionPrice || 2500)}
                    onSuccess={handleSubscriptionSuccess}
                />
            )}
        </div>
    );
}
