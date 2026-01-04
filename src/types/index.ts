export type UserRole = 'creator' | 'fan';
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'resubmit';
export type AccountType = 'fan' | 'creator';
export type PayoutMethod = 'bank' | 'mobile_money' | 'paypal';
export type PayoutFrequency = 'weekly' | 'biweekly' | 'monthly';
export type ContentRating = 'sfw' | 'nsfw';

export interface SubscriptionTier {
    name: string;
    price: number;
}

export interface BankDetails {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    bankBranchCode: string;
    payoutMethod: PayoutMethod;
    payoutFrequency: PayoutFrequency;
    minimumPayout: number;
}

export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    role: UserRole;
    accountType: AccountType;

    // Age Verification
    dateOfBirth: { day: number; month: number; year: number };
    age: number;
    ageVerified: boolean;

    // Location
    country: string;
    countryCode: string;
    countryFlag: string;
    city?: string;

    // Profile
    bio: string;
    avatar: string;
    coverImage: string;
    category: string;

    // Social
    followers: string[]; // User IDs
    following: string[]; // User IDs
    followersCount: number;
    followingCount: number;
    subscribedTo: string[]; // Creator IDs

    // Creator Specific
    isVerified: boolean;
    verificationStatus: VerificationStatus;
    subscribers: string[]; // User IDs
    subscribersCount: number;
    subscriptionPrice: number;
    subscriptionTiers: SubscriptionTier[];

    // Creator Verification Data (Private)
    legalName?: string;
    phoneNumber?: string;
    idVerified?: boolean;
    addressVerified?: boolean;
    taxId?: string;

    // Banking (Private)
    bankDetails?: BankDetails;

    // Stats
    totalPosts: number;
    totalLikes: number;
    totalViews: number;
    totalEarnings: number;
    engagementRate: number;

    // Permissions
    canPost: boolean;

    // Preferences
    contentRating: ContentRating;
    allowExplicitContent: boolean;

    // Messaging Settings
    messagingEnabled: boolean;
    messagingPrice: number;
    autoAcceptMessages: boolean;

    // Status
    isOnline: boolean;
    lastSeen: number; // timestamp
    createdAt: number; // timestamp
    creatorSince?: number; // timestamp
    lastPostAt?: number; // timestamp of last post (for freshness scoring)
    isLoggedIn: boolean;

    // Explore & Personalization
    notInterested?: string[]; // Creator IDs user marked as "not interested"
}

export interface AuthResponse {
    user: User;
    token: string;
}

export type PostType = 'photo' | 'video' | 'album' | 'text' | 'poll' | 'live';
export type PostVisibility = 'free' | 'subscribers' | 'vip' | 'premium';
export type PostStatus = 'published' | 'draft' | 'scheduled' | 'deleted';

export interface Post {
    id: string;
    creatorId: string;
    creatorUsername: string;
    creatorAvatar: string;
    creatorCountry: string;

    type: PostType;
    mediaUrls: string[];
    thumbnailUrl?: string;
    caption: string;

    isNSFW: boolean;
    tags: string[];
    category: string;

    visibility: PostVisibility;
    price: number; // For PPV/Locked content

    likes: number;
    likedBy: string[]; // User IDs
    comments: number;
    shares: number;
    views: number;
    saves: number;

    status: PostStatus;
    publishedAt: number;
    scheduledFor?: number;
    createdAt: number;
    updatedAt: number;

    // Analytics
    revenue: number;
    views_from_subscribers: number;
    conversion_rate: number;
}

export type MessageType = 'text' | 'image' | 'video' | 'gif';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderUsername: string;
    senderAvatar: string;
    recipientId: string;
    recipientUsername: string;

    type: MessageType;
    content: string;
    mediaUrls?: string[];

    isRead: boolean;
    readAt?: number;

    replyToMessageId?: string;

    createdAt: number;
}

export interface ConversationParticipant {
    userId: string;
    username: string;
    avatar: string;
    role: UserRole;
    isOnline: boolean;
    lastSeen: number;
}

export interface Conversation {
    id: string;
    participants: string[]; // User IDs
    participantDetails: ConversationParticipant[];

    lastMessage: string;
    lastMessageAt: number;
    lastMessageSenderId: string;

    unreadCount: { [userId: string]: number };

    isPaid: boolean;
    paidByUserId?: string;
    paidAmount?: number;

    createdAt: number;
    updatedAt: number;
}

export type NotificationType = 'new_message' | 'new_follower' | 'new_subscriber' | 'new_like' | 'new_comment' | 'payment_received';

export interface Notification {
    id: string;
    userId: string; // Recipient
    type: NotificationType;

    fromUserId: string;
    fromUsername: string;
    fromAvatar: string;

    content: string;
    actionUrl: string;

    isRead: boolean;
    createdAt: number;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    createdAt: number;
}
