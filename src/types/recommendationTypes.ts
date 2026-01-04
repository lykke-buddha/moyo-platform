// Recommendation System Types
// Used by the Explore page algorithm for personalized creator discovery

import { User, Post } from './index';

// ============================================================================
// EXPLORE ACTIVITY TRACKING
// ============================================================================

export interface ViewedCreator {
    creatorId: string;
    viewedAt: number; // timestamp
    duration: number; // seconds spent on profile
    actions: ('viewed_posts' | 'clicked_subscribe' | 'followed' | 'subscribed' | 'liked_post' | 'saved_post')[];
}

export interface ExploreActivity {
    // Viewed creators history
    viewedCreators: ViewedCreator[];

    // Search history
    searchHistory: { query: string; timestamp: number }[];

    // Applied filters history
    appliedFilters: { filters: ExploreFilters; timestamp: number }[];

    // Content interactions
    likedContent: string[]; // post IDs
    savedContent: string[]; // post IDs
    sharedContent: string[]; // post IDs
    notInterestedCreators: string[]; // creator IDs

    // Category preferences (calculated from behavior)
    // Higher score = stronger preference (0-1 range)
    categoryAffinities: { [category: string]: number };

    // Price sensitivity (calculated)
    averageSubscriptionPrice: number;
    maxPriceEngaged: number;

    // Content type preferences
    prefersSFW: boolean;
    allowsNSFW: boolean;

    // Geographic preferences
    prefersLocalCreators: boolean;
    viewedCountries: string[]; // country codes

    // Recently viewed (for deduplication)
    recentlyViewedCreatorIds: string[];

    // Last updated
    updatedAt: number;
}

// ============================================================================
// RECOMMENDATION TYPES
// ============================================================================

export type RecommendationReason =
    | 'trending'
    | 'similar_to_followed'
    | 'category_match'
    | 'location_match'
    | 'network_effect'
    | 'rising_star'
    | 'random_discovery'
    | 'popular';

export interface RecommendationCandidate {
    creator: User;
    score: number;
    reason: RecommendationReason;
    reasonDetails: string; // Human-readable: "Popular in Fashion"
}

export interface TrendingCreator {
    creator: User;
    trendingScore: number;
    rank: number;
    category: string;
    engagement24h: number;
    newSubscribers24h: number;
}

export interface RisingStar {
    creator: User;
    growthRate: number; // subscribers per day
    daysActive: number;
    category: string;
}

// ============================================================================
// EXPLORE FILTERS
// ============================================================================

export interface ExploreFilters {
    // Price range (in local currency, e.g. NGN)
    minPrice?: number;
    maxPrice?: number;

    // Location
    countries?: string[]; // country codes

    // Categories (multi-select)
    categories?: string[];

    // Content rating
    contentRating?: 'sfw' | 'nsfw' | 'both';

    // Verification
    verifiedOnly?: boolean;

    // Subscriber count ranges
    subscriberRange?: 'any' | '0-100' | '100-500' | '500-1000' | '1000-5000' | '5000+';

    // Activity
    activeRecently?: boolean; // Posted in last 7 days
    onlineNow?: boolean;

    // New creators
    newCreatorsOnly?: boolean; // Created in last 30 days

    // Sort
    sortBy?: 'relevance' | 'popularity' | 'newest' | 'price_low' | 'price_high';
}

// ============================================================================
// EXPLORE SECTIONS
// ============================================================================

export type ExploreSectionType =
    | 'recommended_for_you'
    | 'trending'
    | 'rising_stars'
    | 'from_your_country'
    | 'because_you_liked'
    | 'category_spotlight'
    | 'verified_creators'
    | 'free_content'
    | 'popular_in_network';

export interface ExploreSection {
    type: ExploreSectionType;
    title: string;
    subtitle?: string;
    creators: RecommendationCandidate[];
    seeMoreLink?: string;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
    creators: User[];
    posts: Post[];
    totalCreators: number;
    totalPosts: number;
}

export interface SearchSuggestion {
    type: 'creator' | 'category' | 'trending' | 'recent';
    text: string;
    subtext?: string;
    avatar?: string;
    creatorId?: string;
}

// ============================================================================
// ALGORITHM CONSTANTS
// ============================================================================

export const ALGORITHM_WEIGHTS = {
    CATEGORY_MATCH: 50,
    LOCATION_MATCH: 20,
    PRICE_FIT: 20,
    VERIFICATION_BONUS: 10,
    TRENDING_BONUS: 15,
    FRESHNESS_MAX: 10,
    NETWORK_EFFECT_PER_MUTUAL: 5,
    RECENTLY_VIEWED_PENALTY: -30,
} as const;

export const CATEGORY_LIST = [
    'Fashion',
    'Fitness',
    'Music',
    'Art',
    'Lifestyle',
    'Beauty',
    'Tech',
    'Dance',
    'Comedy',
    'Education',
    'Food',
    'Travel',
    'Gaming',
    'Sports',
] as const;

export type Category = typeof CATEGORY_LIST[number];

// Default explore activity for new users
export const DEFAULT_EXPLORE_ACTIVITY: ExploreActivity = {
    viewedCreators: [],
    searchHistory: [],
    appliedFilters: [],
    likedContent: [],
    savedContent: [],
    sharedContent: [],
    notInterestedCreators: [],
    categoryAffinities: {},
    averageSubscriptionPrice: 3000,
    maxPriceEngaged: 5000,
    prefersSFW: true,
    allowsNSFW: false,
    prefersLocalCreators: false,
    viewedCountries: [],
    recentlyViewedCreatorIds: [],
    updatedAt: Date.now(),
};

export { DEFAULT_EXPLORE_ACTIVITY as defaultExploreActivity };
