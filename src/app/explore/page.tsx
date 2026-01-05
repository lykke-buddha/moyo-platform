'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MockService } from '@/services/mockService';
import { User } from '@/types';
import { ExploreSection, ExploreFilters, SearchSuggestion, CATEGORY_LIST } from '@/types/recommendationTypes';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
    Search, X, Filter, TrendingUp, Star, MapPin, Sparkles,
    Heart, Users, Crown, Check, MoreHorizontal, ChevronRight
} from 'lucide-react';

// ============================================================================
// CREATOR CARD COMPONENT
// ============================================================================

function CreatorCard({
    creator,
    reason,
    onNotInterested
}: {
    creator: User;
    reason?: string;
    onNotInterested?: (id: string) => void;
}) {
    const [showMenu, setShowMenu] = useState(false);
    const { user: currentUser } = useAuth();

    return (
        <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300">
            {/* Cover Image */}
            <div className="relative h-24 bg-gradient-to-br from-amber-500/20 to-zinc-900">
                {creator.coverImage && (
                    <img
                        src={creator.coverImage}
                        className="w-full h-full object-cover opacity-60"
                        alt=""
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            {/* Avatar */}
            <div className="absolute top-14 left-4">
                <div className="relative">
                    <img
                        src={creator.avatar}
                        className="w-16 h-16 rounded-full border-4 border-zinc-900 object-cover"
                        alt={creator.displayName}
                    />
                    {creator.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                            <Check className="w-3 h-3 text-zinc-950" strokeWidth={3} />
                        </div>
                    )}
                </div>
            </div>

            {/* Country Flag */}
            {creator.countryFlag && (
                <div className="absolute top-2 right-2 text-lg">
                    {creator.countryFlag}
                </div>
            )}

            {/* Menu Button */}
            <button
                onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
                <div className="absolute top-10 left-2 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[160px]">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onNotInterested?.(creator.id);
                            setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                        Not Interested
                    </button>
                </div>
            )}

            {/* Content */}
            <Link href={`/profile/${creator.username}`} className="block px-4 pt-10 pb-4">
                <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-semibold text-zinc-100 truncate text-sm">{creator.displayName}</h3>
                </div>
                <p className="text-zinc-500 text-xs mb-2">@{creator.username}</p>

                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-[10px] text-zinc-400 font-medium">
                        {creator.category || 'Creator'}
                    </span>
                    {reason && (
                        <span className="text-[10px] text-amber-500/80 truncate">
                            {reason}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{creator.subscribersCount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{creator.totalLikes?.toLocaleString() || 0}</span>
                    </div>
                </div>

                {/* Price & Subscribe */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Crown className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                            {creator.subscriptionPrice > 0
                                ? `R${creator.subscriptionPrice?.toLocaleString()}/mo`
                                : 'Free'}
                        </span>
                    </div>
                    <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold rounded-lg transition-colors">
                        Subscribe
                    </button>
                </div>
            </Link>
        </div>
    );
}

// ============================================================================
// EXPLORE SECTION COMPONENT
// ============================================================================

function ExplorePageSection({ section }: { section: ExploreSection }) {
    const sectionIcons: Record<string, React.ReactNode> = {
        'recommended_for_you': <Sparkles className="w-4 h-4 text-amber-500" />,
        'trending': <TrendingUp className="w-4 h-4 text-red-500" />,
        'rising_stars': <Star className="w-4 h-4 text-yellow-500" />,
        'from_your_country': <MapPin className="w-4 h-4 text-green-500" />,
        'category_spotlight': <Heart className="w-4 h-4 text-pink-500" />,
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {sectionIcons[section.type]}
                    <h2 className="text-zinc-100 font-semibold text-lg">{section.title}</h2>
                </div>
                <button className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors">
                    <span>See all</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            {section.subtitle && (
                <p className="text-zinc-500 text-sm mb-4 -mt-2">{section.subtitle}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.creators.slice(0, 8).map((item) => (
                    <CreatorCard
                        key={item.creator.id}
                        creator={item.creator}
                        reason={item.reasonDetails}
                    />
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// FILTER PANEL COMPONENT
// ============================================================================

function FilterPanel({
    filters,
    onChange,
    onClose
}: {
    filters: ExploreFilters;
    onChange: (filters: ExploreFilters) => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-sm bg-zinc-900 border-l border-zinc-800 h-full overflow-y-auto animate-in slide-in-from-right"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-100">Filters</h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Price Range */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-3 block">
                            Price Range (R/month)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice || ''}
                                onChange={e => onChange({ ...filters, minPrice: Number(e.target.value) || undefined })}
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200"
                            />
                            <span className="text-zinc-500">–</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice || ''}
                                onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) || undefined })}
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-3 block">
                            Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_LIST.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        const current = filters.categories || [];
                                        const updated = current.includes(cat)
                                            ? current.filter(c => c !== cat)
                                            : [...current, cat];
                                        onChange({ ...filters, categories: updated.length ? updated : undefined });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filters.categories?.includes(cat)
                                        ? 'bg-amber-500 text-zinc-950 border-amber-500'
                                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-zinc-300">Verified Only</span>
                            <input
                                type="checkbox"
                                checked={filters.verifiedOnly || false}
                                onChange={e => onChange({ ...filters, verifiedOnly: e.target.checked || undefined })}
                                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-zinc-300">Online Now</span>
                            <input
                                type="checkbox"
                                checked={filters.onlineNow || false}
                                onChange={e => onChange({ ...filters, onlineNow: e.target.checked || undefined })}
                                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-zinc-300">New Creators Only</span>
                            <input
                                type="checkbox"
                                checked={filters.newCreatorsOnly || false}
                                onChange={e => onChange({ ...filters, newCreatorsOnly: e.target.checked || undefined })}
                                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                            />
                        </label>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-3 block">
                            Sort By
                        </label>
                        <select
                            value={filters.sortBy || 'relevance'}
                            onChange={e => onChange({ ...filters, sortBy: e.target.value as ExploreFilters['sortBy'] })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="popularity">Most Popular</option>
                            <option value="newest">Newest</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => onChange({})}
                            className="flex-1 py-2.5 border border-zinc-700 text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-amber-500 text-zinc-950 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN EXPLORE PAGE
// ============================================================================

export default function ExplorePage() {
    const { user: currentUser, isLoggedIn } = useAuth();
    const [sections, setSections] = useState<ExploreSection[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filters, setFilters] = useState<ExploreFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchRef = useRef<HTMLInputElement>(null);

    // Quick filter categories with emojis
    const quickCategories = [
        { id: null, label: 'For You', icon: '✨' },
        { id: 'trending', label: 'Trending', icon: '🔥' },
        { id: 'verified', label: 'Verified', icon: '⭐' },
        { id: 'new', label: 'New', icon: '🆕' },
        { id: 'Fashion', label: 'Fashion', icon: '👗' },
        { id: 'Fitness', label: 'Fitness', icon: '💪' },
        { id: 'Music', label: 'Music', icon: '🎵' },
        { id: 'Art', label: 'Art', icon: '🎨' },
        { id: 'Lifestyle', label: 'Lifestyle', icon: '🍳' },
    ];

    // Load sections on mount
    useEffect(() => {
        loadSections();
    }, [currentUser]);

    const loadSections = async () => {
        setIsLoading(true);
        try {
            const data = await MockService.getExploreSections();
            setSections(data as ExploreSection[]);
        } catch (error) {
            console.error('Failed to load explore sections:', error);
        }
        setIsLoading(false);
    };

    // Handle search
    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        // Get suggestions
        const sugg = await MockService.getSearchSuggestions(query);
        setSuggestions(sugg);
        setShowSuggestions(true);

        // Search creators
        const results = await MockService.searchCreators(query, filters);
        setSearchResults(results);

        // Track search activity
        MockService.trackExploreActivity({ type: 'search', query });
    }, [filters]);

    // Handle category filter
    const handleCategorySelect = async (categoryId: string | null) => {
        setActiveCategory(categoryId);

        if (!categoryId) {
            loadSections();
            return;
        }

        // Special filters
        if (categoryId === 'trending' || categoryId === 'verified' || categoryId === 'new') {
            const newFilters = {
                ...filters,
                verifiedOnly: categoryId === 'verified' || undefined,
                newCreatorsOnly: categoryId === 'new' || undefined,
            };
            setFilters(newFilters);
            const results = await MockService.searchCreators('', newFilters);
            setSearchResults(results);
        } else {
            // Category filter
            setFilters({ ...filters, categories: [categoryId] });
            const results = await MockService.searchCreators('', { categories: [categoryId] });
            setSearchResults(results);
        }
    };

    // Handle not interested
    const handleNotInterested = async (creatorId: string) => {
        await MockService.markNotInterested(creatorId);
        // Refresh sections
        loadSections();
    };

    return (
        <div className="pb-24 md:pb-10 min-h-screen">
            {/* Search Header */}
            <header className="sticky top-0 z-40 glass border-b border-zinc-800/50 px-4 py-3 bg-zinc-950/90 backdrop-blur">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
                                <Search className="w-4.5 h-4.5" strokeWidth={2} />
                            </div>
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search creators, categories, locations..."
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/30 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSuggestions(false); }}
                                    className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                                    {suggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSearchQuery(suggestion.text);
                                                handleSearch(suggestion.text);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800 transition-colors text-left"
                                        >
                                            {suggestion.avatar ? (
                                                <img src={suggestion.avatar} className="w-8 h-8 rounded-full" alt="" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <Search className="w-4 h-4 text-zinc-500" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-zinc-200">{suggestion.text}</p>
                                                {suggestion.subtext && (
                                                    <p className="text-xs text-zinc-500">{suggestion.subtext}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(true)}
                            className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                        >
                            <Filter className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto w-full px-4 pt-4">
                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                    {quickCategories.map((cat) => (
                        <button
                            key={cat.id || 'foryou'}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${activeCategory === cat.id
                                ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg shadow-amber-500/10'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Search Results */}
                {!isLoading && searchResults.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-zinc-100 font-semibold text-lg mb-4">
                            {searchQuery ? `Results for "${searchQuery}"` : 'Creators'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {searchResults.map((creator) => (
                                <CreatorCard
                                    key={creator.id}
                                    creator={creator}
                                    onNotInterested={handleNotInterested}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sections */}
                {!isLoading && !searchQuery && searchResults.length === 0 && (
                    <>
                        {sections.map((section, i) => (
                            <ExplorePageSection key={section.type + i} section={section} />
                        ))}
                    </>
                )}

                {/* Empty State */}
                {!isLoading && searchQuery && searchResults.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-zinc-200 font-semibold mb-2">No results found</h3>
                        <p className="text-zinc-500 text-sm">Try a different search or browse categories</p>
                    </div>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    onClose={() => setShowFilters(false)}
                />
            )}
        </div>
    );
}
