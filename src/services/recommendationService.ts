// Recommendation Service
// Implements the core algorithm for personalized creator discovery

import { User, Post } from '@/types';
import {
    ExploreActivity,
    RecommendationCandidate,
    RecommendationReason,
    TrendingCreator,
    RisingStar,
    ExploreFilters,
    ExploreSection,
    ExploreSectionType,
    SearchResult,
    SearchSuggestion,
    ALGORITHM_WEIGHTS,
    CATEGORY_LIST,
    DEFAULT_EXPLORE_ACTIVITY,
} from '@/types/recommendationTypes';

// ============================================================================
// CANDIDATE SELECTION FUNCTIONS
// ============================================================================

/**
 * Get trending creators based on engagement velocity
 */
export function getTrendingCreators(
    creators: User[],
    posts: Post[],
    limit: number = 50
): TrendingCreator[] {
    const now = Date.now();
    const oneDayAgo = now - 86400000; // 24 hours

    return creators
        .filter(c => c.role === 'creator' && c.isVerified)
        .map(creator => {
            // Get posts from last 24 hours
            const recentPosts = posts.filter(
                p => p.creatorId === creator.id && p.publishedAt > oneDayAgo
            );

            // Calculate engagement in last 24 hours
            const engagement24h = recentPosts.reduce(
                (sum, post) => sum + post.likes + post.comments * 2 + post.shares * 3,
                0
            );

            // Virality factor (engagement / followers)
            const viralityScore = engagement24h / Math.max(creator.followersCount, 1);

            // Simulated new subscribers (based on engagement rate)
            const newSubscribers24h = Math.floor(engagement24h * 0.01);

            // Combined trending score
            const trendingScore =
                engagement24h * 0.5 + viralityScore * 100 + newSubscribers24h * 10;

            return {
                creator,
                trendingScore,
                rank: 0, // Will be set after sorting
                category: creator.category,
                engagement24h,
                newSubscribers24h,
            };
        })
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}

/**
 * Get creators similar to who the user follows
 */
export function getSimilarToFollowed(
    currentUser: User,
    allCreators: User[],
    limit: number = 100
): User[] {
    if (currentUser.following.length === 0) return [];

    // Get categories of followed creators
    const followedCreators = allCreators.filter(c =>
        currentUser.following.includes(c.id)
    );
    const followedCategories = new Set(followedCreators.map(c => c.category));
    const followedCountries = new Set(followedCreators.map(c => c.countryCode));

    // Find similar creators not yet followed
    return allCreators
        .filter(c =>
            c.role === 'creator' &&
            !currentUser.following.includes(c.id) &&
            !currentUser.subscribedTo.includes(c.id) &&
            c.id !== currentUser.id &&
            (followedCategories.has(c.category) || followedCountries.has(c.countryCode))
        )
        .sort((a, b) => {
            // Prioritize same category and country matches
            const aScore =
                (followedCategories.has(a.category) ? 2 : 0) +
                (followedCountries.has(a.countryCode) ? 1 : 0);
            const bScore =
                (followedCategories.has(b.category) ? 2 : 0) +
                (followedCountries.has(b.countryCode) ? 1 : 0);
            return bScore - aScore || b.subscribersCount - a.subscribersCount;
        })
        .slice(0, limit);
}

/**
 * Get creators by preferred categories
 */
export function getByCategory(
    categoryAffinities: { [category: string]: number },
    allCreators: User[],
    currentUser: User,
    limit: number = 100
): User[] {
    // Get top categories sorted by affinity
    const topCategories = Object.entries(categoryAffinities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat);

    if (topCategories.length === 0) {
        // Default to popular categories for new users
        topCategories.push('Fashion', 'Music', 'Lifestyle');
    }

    return allCreators
        .filter(c =>
            c.role === 'creator' &&
            !currentUser.following.includes(c.id) &&
            !currentUser.subscribedTo.includes(c.id) &&
            c.id !== currentUser.id &&
            topCategories.includes(c.category)
        )
        .sort((a, b) => {
            const aAffinity = categoryAffinities[a.category] || 0;
            const bAffinity = categoryAffinities[b.category] || 0;
            return bAffinity - aAffinity || b.subscribersCount - a.subscribersCount;
        })
        .slice(0, limit);
}

/**
 * Get creators from user's country
 */
export function getByLocation(
    countryCode: string,
    allCreators: User[],
    currentUser: User,
    limit: number = 50
): User[] {
    return allCreators
        .filter(c =>
            c.role === 'creator' &&
            c.countryCode === countryCode &&
            !currentUser.following.includes(c.id) &&
            !currentUser.subscribedTo.includes(c.id) &&
            c.id !== currentUser.id
        )
        .sort((a, b) => b.subscribersCount - a.subscribersCount)
        .slice(0, limit);
}

/**
 * Get rising stars (new creators with fast growth)
 */
export function getRisingStars(
    allCreators: User[],
    limit: number = 50
): RisingStar[] {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 86400000;

    return allCreators
        .filter(c =>
            c.role === 'creator' &&
            c.creatorSince &&
            c.creatorSince > thirtyDaysAgo &&
            c.subscribersCount > 0
        )
        .map(creator => {
            const daysActive = Math.max(
                1,
                Math.ceil((now - (creator.creatorSince || now)) / 86400000)
            );
            const growthRate = creator.subscribersCount / daysActive;

            return {
                creator,
                growthRate,
                daysActive,
                category: creator.category,
            };
        })
        .sort((a, b) => b.growthRate - a.growthRate)
        .slice(0, limit);
}

/**
 * Get random creators for diversity
 */
export function getRandomForDiversity(
    allCreators: User[],
    currentUser: User,
    limit: number = 50
): User[] {
    const eligible = allCreators.filter(c =>
        c.role === 'creator' &&
        !currentUser.following.includes(c.id) &&
        !currentUser.subscribedTo.includes(c.id) &&
        c.id !== currentUser.id &&
        !(currentUser.notInterested || []).includes(c.id)
    );

    // Fisher-Yates shuffle
    const shuffled = [...eligible];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, limit);
}

// ============================================================================
// SCORING & RANKING
// ============================================================================

/**
 * Calculate recommendation score for a creator
 */
export function calculateRecommendationScore(
    creator: User,
    currentUser: User,
    exploreActivity: ExploreActivity
): { score: number; reason: RecommendationReason; reasonDetails: string } {
    let score = 0;
    let primaryReason: RecommendationReason = 'popular';
    let reasonDetails = 'Popular creator';

    // Category match (highest weight)
    const categoryAffinity = exploreActivity.categoryAffinities[creator.category] || 0;
    if (categoryAffinity > 0) {
        const categoryScore = categoryAffinity * ALGORITHM_WEIGHTS.CATEGORY_MATCH;
        score += categoryScore;
        if (categoryScore > 20) {
            primaryReason = 'category_match';
            reasonDetails = `Popular in ${creator.category}`;
        }
    }

    // Location match
    if (creator.countryCode === currentUser.countryCode) {
        score += ALGORITHM_WEIGHTS.LOCATION_MATCH;
        if (score < 30) {
            primaryReason = 'location_match';
            reasonDetails = `Creator from ${creator.country}`;
        }
    }

    // Price fit (closer to average = higher score)
    const priceDiff = Math.abs(
        creator.subscriptionPrice - exploreActivity.averageSubscriptionPrice
    );
    const priceScore = Math.max(
        0,
        ALGORITHM_WEIGHTS.PRICE_FIT - priceDiff / 100
    );
    score += priceScore;

    // Creator quality
    score += Math.log(creator.subscribersCount + 1) * 5;
    score += creator.engagementRate * 3;

    // Verification bonus
    if (creator.isVerified) {
        score += ALGORITHM_WEIGHTS.VERIFICATION_BONUS;
    }

    // Freshness (days since last post)
    if (creator.lastPostAt) {
        const daysSinceLastPost = (Date.now() - creator.lastPostAt) / 86400000;
        score += Math.max(0, ALGORITHM_WEIGHTS.FRESHNESS_MAX - daysSinceLastPost);
    }

    // Network effects (mutual connections)
    const mutualFollows = currentUser.following.filter(id =>
        creator.followers.includes(id)
    ).length;
    score += mutualFollows * ALGORITHM_WEIGHTS.NETWORK_EFFECT_PER_MUTUAL;
    if (mutualFollows > 2) {
        primaryReason = 'network_effect';
        reasonDetails = `${mutualFollows} people you follow also follow`;
    }

    // Penalty for recently viewed
    if (exploreActivity.recentlyViewedCreatorIds.includes(creator.id)) {
        score += ALGORITHM_WEIGHTS.RECENTLY_VIEWED_PENALTY;
    }

    // Penalty for "not interested"
    if (exploreActivity.notInterestedCreators.includes(creator.id)) {
        score -= 1000; // Effectively exclude
    }

    return { score, reason: primaryReason, reasonDetails };
}

// ============================================================================
// DIVERSITY RULES
// ============================================================================

/**
 * Apply diversity rules to prevent filter bubbles
 */
export function applyDiversityRules(
    rankedList: RecommendationCandidate[],
    maxConsecutiveSameCategory: number = 2
): RecommendationCandidate[] {
    const result: RecommendationCandidate[] = [];
    const categoryQueue: string[] = [];

    for (const item of rankedList) {
        const category = item.creator.category;

        // Check if we've shown this category too many times recently
        const recentCategorySameCount = categoryQueue
            .slice(-maxConsecutiveSameCategory)
            .filter(c => c === category).length;

        if (recentCategorySameCount >= maxConsecutiveSameCategory) {
            // Skip this one for now (could be added to a "later" queue)
            continue;
        }

        result.push(item);
        categoryQueue.push(category);
    }

    return result;
}

// ============================================================================
// MAIN RECOMMENDATION FUNCTION
// ============================================================================

/**
 * Get personalized explore recommendations
 */
export function getExploreRecommendations(
    currentUser: User,
    allCreators: User[],
    allPosts: Post[],
    exploreActivity: ExploreActivity = DEFAULT_EXPLORE_ACTIVITY,
    limit: number = 50
): RecommendationCandidate[] {
    // Stage 1: Candidate Selection (~500 candidates)
    const candidates: User[] = [];

    // Get trending creators
    const trending = getTrendingCreators(allCreators, allPosts, 50);
    candidates.push(...trending.map(t => t.creator));

    // Get similar to followed
    candidates.push(...getSimilarToFollowed(currentUser, allCreators, 100));

    // Get by category
    candidates.push(
        ...getByCategory(
            exploreActivity.categoryAffinities,
            allCreators,
            currentUser,
            100
        )
    );

    // Get by location
    candidates.push(
        ...getByLocation(currentUser.countryCode, allCreators, currentUser, 50)
    );

    // Get rising stars
    const risingStars = getRisingStars(allCreators, 50);
    candidates.push(...risingStars.map(r => r.creator));

    // Get random for diversity
    candidates.push(...getRandomForDiversity(allCreators, currentUser, 50));

    // Remove duplicates and already following/subscribed
    const uniqueIds = new Set<string>();
    const filtered = candidates.filter(creator => {
        if (
            uniqueIds.has(creator.id) ||
            currentUser.following.includes(creator.id) ||
            currentUser.subscribedTo.includes(creator.id) ||
            creator.id === currentUser.id ||
            (currentUser.notInterested || []).includes(creator.id)
        ) {
            return false;
        }
        uniqueIds.add(creator.id);
        return true;
    });

    // Stage 2: Scoring
    const scored: RecommendationCandidate[] = filtered.map(creator => {
        const { score, reason, reasonDetails } = calculateRecommendationScore(
            creator,
            currentUser,
            exploreActivity
        );
        return { creator, score, reason, reasonDetails };
    });

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Stage 3: Apply diversity rules
    const diverse = applyDiversityRules(scored);

    // Return top results
    return diverse.slice(0, limit);
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Search creators with filters
 */
export function searchCreators(
    query: string,
    allCreators: User[],
    filters: ExploreFilters = {}
): User[] {
    const normalizedQuery = query.toLowerCase().trim();

    let results = allCreators.filter(c => c.role === 'creator');

    // Text search
    if (normalizedQuery) {
        results = results.filter(c =>
            c.username.toLowerCase().includes(normalizedQuery) ||
            c.displayName.toLowerCase().includes(normalizedQuery) ||
            c.category.toLowerCase().includes(normalizedQuery) ||
            c.bio.toLowerCase().includes(normalizedQuery) ||
            c.country.toLowerCase().includes(normalizedQuery)
        );
    }

    // Apply filters
    if (filters.minPrice !== undefined) {
        results = results.filter(c => c.subscriptionPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        results = results.filter(c => c.subscriptionPrice <= filters.maxPrice!);
    }
    if (filters.countries && filters.countries.length > 0) {
        results = results.filter(c => filters.countries!.includes(c.countryCode));
    }
    if (filters.categories && filters.categories.length > 0) {
        results = results.filter(c => filters.categories!.includes(c.category));
    }
    if (filters.verifiedOnly) {
        results = results.filter(c => c.isVerified);
    }
    if (filters.onlineNow) {
        results = results.filter(c => c.isOnline);
    }
    if (filters.newCreatorsOnly) {
        const thirtyDaysAgo = Date.now() - 30 * 86400000;
        results = results.filter(c => c.creatorSince && c.creatorSince > thirtyDaysAgo);
    }

    // Sort
    switch (filters.sortBy) {
        case 'popularity':
            results.sort((a, b) => b.subscribersCount - a.subscribersCount);
            break;
        case 'newest':
            results.sort((a, b) => (b.creatorSince || 0) - (a.creatorSince || 0));
            break;
        case 'price_low':
            results.sort((a, b) => a.subscriptionPrice - b.subscriptionPrice);
            break;
        case 'price_high':
            results.sort((a, b) => b.subscriptionPrice - a.subscriptionPrice);
            break;
        default:
            // Relevance (default)
            results.sort((a, b) => b.engagementRate - a.engagementRate);
    }

    return results;
}

/**
 * Get search suggestions
 */
export function getSearchSuggestions(
    query: string,
    allCreators: User[],
    recentSearches: string[]
): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    // Recent searches (if no query)
    if (!normalizedQuery) {
        recentSearches.slice(0, 3).forEach(search => {
            suggestions.push({
                type: 'recent',
                text: search,
            });
        });

        // Trending categories
        CATEGORY_LIST.slice(0, 5).forEach(cat => {
            suggestions.push({
                type: 'category',
                text: cat,
                subtext: 'Category',
            });
        });

        return suggestions;
    }

    // Creator matches
    const creatorMatches = allCreators
        .filter(c =>
            c.role === 'creator' &&
            (c.username.toLowerCase().includes(normalizedQuery) ||
                c.displayName.toLowerCase().includes(normalizedQuery))
        )
        .slice(0, 5);

    creatorMatches.forEach(c => {
        suggestions.push({
            type: 'creator',
            text: c.displayName,
            subtext: `@${c.username}`,
            avatar: c.avatar,
            creatorId: c.id,
        });
    });

    // Category matches
    CATEGORY_LIST
        .filter(cat => cat.toLowerCase().includes(normalizedQuery))
        .slice(0, 3)
        .forEach(cat => {
            suggestions.push({
                type: 'category',
                text: cat,
                subtext: 'Category',
            });
        });

    return suggestions;
}

// ============================================================================
// SECTION BUILDERS
// ============================================================================

/**
 * Build explore sections for the UI
 */
export function buildExploreSections(
    currentUser: User,
    allCreators: User[],
    allPosts: Post[],
    exploreActivity: ExploreActivity = DEFAULT_EXPLORE_ACTIVITY
): ExploreSection[] {
    const sections: ExploreSection[] = [];

    // 1. Recommended For You
    const recommendations = getExploreRecommendations(
        currentUser,
        allCreators,
        allPosts,
        exploreActivity,
        10
    );
    if (recommendations.length > 0) {
        sections.push({
            type: 'recommended_for_you',
            title: 'Recommended For You',
            subtitle: 'Based on your activity',
            creators: recommendations,
        });
    }

    // 2. Trending Creators
    const trending = getTrendingCreators(allCreators, allPosts, 10);
    if (trending.length > 0) {
        sections.push({
            type: 'trending',
            title: 'Trending Creators 🔥',
            subtitle: 'Hot right now',
            creators: trending.map(t => ({
                creator: t.creator,
                score: t.trendingScore,
                reason: 'trending' as RecommendationReason,
                reasonDetails: `#${t.rank} Trending`,
            })),
        });
    }

    // 3. Rising Stars
    const risingStars = getRisingStars(allCreators, 10);
    if (risingStars.length > 0) {
        sections.push({
            type: 'rising_stars',
            title: 'Rising Stars ⭐',
            subtitle: 'New creators on the rise',
            creators: risingStars.map(r => ({
                creator: r.creator,
                score: r.growthRate,
                reason: 'rising_star' as RecommendationReason,
                reasonDetails: `${r.daysActive} days active`,
            })),
        });
    }

    // 4. From Your Country
    const localCreators = getByLocation(
        currentUser.countryCode,
        allCreators,
        currentUser,
        10
    );
    if (localCreators.length > 0) {
        sections.push({
            type: 'from_your_country',
            title: `From ${currentUser.country} ${currentUser.countryFlag}`,
            subtitle: 'Local creators',
            creators: localCreators.map(c => ({
                creator: c,
                score: c.subscribersCount,
                reason: 'location_match' as RecommendationReason,
                reasonDetails: c.city || c.country,
            })),
        });
    }

    // 5. Category Spotlight (based on top affinity)
    const topCategory = Object.entries(exploreActivity.categoryAffinities)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
    if (topCategory) {
        const categoryCreators = allCreators
            .filter(c =>
                c.role === 'creator' &&
                c.category === topCategory &&
                !currentUser.following.includes(c.id)
            )
            .slice(0, 10);
        if (categoryCreators.length > 0) {
            sections.push({
                type: 'category_spotlight',
                title: `Because you like ${topCategory}`,
                creators: categoryCreators.map(c => ({
                    creator: c,
                    score: c.subscribersCount,
                    reason: 'category_match' as RecommendationReason,
                    reasonDetails: topCategory,
                })),
            });
        }
    }

    return sections;
}
