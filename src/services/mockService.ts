import {
    User, Post, Message, Conversation, Notification,
    UserRole, AuthResponse, PostType, PostVisibility
} from '@/types';
import { MOCK_USERS, MOCK_POSTS, MOCK_MESSAGES, MOCK_CONVERSATIONS } from './seedData';

// --- IN-MEMORY DATABASE ---
let users: User[] = [...MOCK_USERS];
let posts: Post[] = [...MOCK_POSTS];
let messages: Message[] = [...MOCK_MESSAGES];
let conversations: Conversation[] = [...MOCK_CONVERSATIONS];
let notifications: Notification[] = []; // Start empty or seed if needed

let currentUser: User | null = null;
const SIMULATED_DELAY = 400; // ms

// --- HELPERS ---
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const MockService = {
    // =========================================================================
    // AUTHENTICATION
    // =========================================================================

    async login(email: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

        if (!email || !password) throw new Error('Email and password are required');

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // FOR TESTING: Accept any password that is not empty
        // In a real app we would hash and compare.
        // const VALID_PASSWORD = "Password123!";

        // if (!user || password !== VALID_PASSWORD) {
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const token = `mock_token_${user.id}_${Date.now()}`;

        // Update state
        user.isLoggedIn = true;
        currentUser = user;
        this._updateUserInStore(user);

        // Persistence
        const maxAge = rememberMe ? 60 * 60 * 24 * 7 : undefined; // 7 days or session
        this._setCookie('moyo_auth_token', token, maxAge);
        this._setCookie('moyo_user_id', user.id, maxAge);

        return { user, token };
    },

    async signup(email: string, password: string, username: string, role: UserRole, dob: { day: number, month: number, year: number }, countryData?: { name: string, code: string, flag: string }): Promise<AuthResponse> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

        if (users.find(u => u.email === email)) throw new Error('Email already registered');
        if (users.find(u => u.username === username)) throw new Error('Username already taken');

        // Calculate Age
        const today = new Date();
        let age = today.getFullYear() - dob.year;
        const m = today.getMonth() + 1 - dob.month;
        if (m < 0 || (m === 0 && today.getDate() < dob.day)) {
            age--;
        }

        if (age < 18) {
            throw new Error('You must be at least 18 years old to sign up.');
        }

        const newUser: User = {
            id: generateId('user'),
            email,
            username,
            displayName: username,
            role,
            accountType: role as any,
            age,
            dateOfBirth: dob,
            ageVerified: false,
            country: countryData?.name || '',
            countryCode: countryData?.code || '',
            countryFlag: countryData?.flag || '',
            bio: '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            coverImage: '',
            category: 'General',
            followers: [],
            following: [],
            followersCount: 0,
            followingCount: 0,
            subscribedTo: [],
            isVerified: false,
            verificationStatus: 'pending',
            subscribers: [],
            subscribersCount: 0,
            subscriptionPrice: 0,
            subscriptionTiers: [],
            totalPosts: 0,
            totalLikes: 0,
            totalViews: 0,
            totalEarnings: 0,
            engagementRate: 0,
            canPost: role === 'creator',
            contentRating: 'sfw',
            allowExplicitContent: false,
            messagingEnabled: role === 'creator',
            messagingPrice: 0,
            autoAcceptMessages: false,
            isOnline: true,
            lastSeen: Date.now(),
            createdAt: Date.now(),
            isLoggedIn: true
        };

        users.push(newUser);
        currentUser = newUser;

        const token = `mock_token_${newUser.id}_${Date.now()}`;
        this._setCookie('moyo_auth_token', token);
        this._setCookie('moyo_user_id', newUser.id);

        return { user: newUser, token };
    },

    async logout(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (currentUser) {
            currentUser.isLoggedIn = false;
            this._updateUserInStore(currentUser);
        }
        currentUser = null;
        this._deleteCookie('moyo_auth_token');
        this._deleteCookie('moyo_user_id');
    },

    async checkSession(): Promise<User | null> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const userId = this._getCookie('moyo_user_id');
        const token = this._getCookie('moyo_auth_token');

        if (userId && token) {
            const user = users.find(u => u.id === userId);
            if (user) {
                user.isLoggedIn = true;
                currentUser = user;
                this._updateUserInStore(user);
                return user;
            }
        }
        return null;
    },

    async updateProfile(updates: Partial<User>): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) throw new Error('No active session');

        const updatedUser = { ...currentUser, ...updates };
        this._updateUserInStore(updatedUser);
        currentUser = updatedUser;
        return updatedUser;
    },

    // =========================================================================
    // CREATORS & INTERACTIONS
    // =========================================================================

    async getCreators(): Promise<User[]> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        return users.filter(u => u.role === 'creator');
    },

    async getCreatorById(id: string): Promise<User | undefined> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return users.find(u => u.id === id);
    },

    async getUserByUsername(username: string): Promise<User | null> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        const normalized = username.toLowerCase().replace('@', '');
        return users.find(u => u.username.toLowerCase() === normalized) || null;
    },

    async getPostsByUserId(userId: string): Promise<Post[]> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        return posts.filter(p => p.creatorId === userId).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    },

    async toggleFollow(targetUserId: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) throw new Error('Must be logged in');

        const targetUser = users.find(u => u.id === targetUserId);
        if (!targetUser) throw new Error('User not found');

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id !== targetUserId);
            currentUser.followingCount--;
            targetUser.followers = targetUser.followers.filter(id => id !== currentUser!.id);
            targetUser.followersCount--;
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            currentUser.followingCount++;
            targetUser.followers.push(currentUser.id);
            targetUser.followersCount++;

            // Notification
            this._createNotification(targetUserId, 'new_follower', `${currentUser.displayName} started following you.`, `/profile/${currentUser.username}`);
        }

        this._updateUserInStore(currentUser);
        this._updateUserInStore(targetUser);

        return currentUser;
    },

    async toggleSubscribe(targetUserId: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) throw new Error('Must be logged in');

        const targetUser = users.find(u => u.id === targetUserId);
        if (!targetUser) throw new Error('User not found');

        const isSubscribed = currentUser.subscribedTo.includes(targetUserId);

        if (isSubscribed) {
            // Unsubscribe
            currentUser.subscribedTo = currentUser.subscribedTo.filter(id => id !== targetUserId);
            targetUser.subscribers = targetUser.subscribers.filter(id => id !== currentUser!.id);
            targetUser.subscribersCount--;
        } else {
            // Subscribe (Mock Payment would go here)
            currentUser.subscribedTo.push(targetUserId);
            targetUser.subscribers.push(currentUser.id);
            targetUser.subscribersCount++;

            // Notification
            this._createNotification(targetUserId, 'new_subscriber', `${currentUser.displayName} subscribed to your profile!`, `/profile/${currentUser.username}`);
        }

        this._updateUserInStore(currentUser);
        this._updateUserInStore(targetUser);
        return currentUser;
    },


    // =========================================================================
    // FEED & POSTS
    // =========================================================================

    async getFeed(filter: 'for_you' | 'following' = 'for_you'): Promise<Post[]> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

        let feed = [...posts];

        if (filter === 'following' && currentUser) {
            feed = feed.filter(p => currentUser!.following.includes(p.creatorId) || p.creatorId === currentUser!.id);
        }

        // Sort by date desc
        return feed.sort((a, b) => b.publishedAt - a.publishedAt);
    },

    async createPost(postData: Partial<Post>): Promise<Post> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) throw new Error('Must be logged in');

        const newPost: Post = {
            id: generateId('post'),
            creatorId: currentUser.id,
            creatorUsername: currentUser.username,
            creatorAvatar: currentUser.avatar,
            creatorCountry: currentUser.country,
            type: postData.type || 'text',
            mediaUrls: postData.mediaUrls || [],
            thumbnailUrl: postData.thumbnailUrl,
            caption: postData.caption || '',
            isNSFW: postData.isNSFW || false,
            tags: postData.tags || [],
            category: currentUser.category || 'General',
            visibility: postData.visibility || 'free',
            price: postData.price || 0,
            likes: 0,
            likedBy: [],
            comments: 0,
            shares: 0,
            views: 0,
            saves: 0,
            status: 'published',
            publishedAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            revenue: 0,
            views_from_subscribers: 0,
            conversion_rate: 0
        };

        posts.unshift(newPost); // Add to top
        currentUser.totalPosts++;
        this._updateUserInStore(currentUser);

        return newPost;
    },

    async toggleLikePost(postId: string): Promise<Post> {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!currentUser) throw new Error('Must be logged in');

        const post = posts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        const hasLiked = post.likedBy.includes(currentUser.id);
        if (hasLiked) {
            post.likedBy = post.likedBy.filter(id => id !== currentUser!.id);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            post.likedBy.push(currentUser.id);
            post.likes++;

            if (post.creatorId !== currentUser.id) {
                this._createNotification(post.creatorId, 'new_like', `${currentUser.displayName} liked your post`, `/post/${post.id}`);
            }
        }
        return post;
    },

    async toggleBookmarkPost(postId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!currentUser) throw new Error('Must be logged in');
        // In a real app we'd have a bookmarks array on User. for now just return true/false toggled
        return true;
    },


    // =========================================================================
    // MESSAGING
    // =========================================================================

    async getConversations(): Promise<Conversation[]> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) return [];
        return conversations.filter(c => c.participants.includes(currentUser!.id))
            .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    },

    async getMessages(conversationId: string): Promise<Message[]> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) return [];
        return messages.filter(m => m.conversationId === conversationId).sort((a, b) => a.createdAt - b.createdAt);
    },

    async sendMessage(recipientId: string, content: string, type: 'text' | 'image' = 'text'): Promise<Message> {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
        if (!currentUser) throw new Error('Not logged in');

        // Check if conversation exists
        let conversation = conversations.find(c =>
            c.participants.includes(currentUser!.id) && c.participants.includes(recipientId)
        );

        if (!conversation) {
            // Create new conversation
            const recipient = users.find(u => u.id === recipientId);
            if (!recipient) throw new Error('Recipient not found');

            conversation = {
                id: generateId('conv'),
                participants: [currentUser.id, recipientId],
                participantDetails: [
                    {
                        userId: currentUser.id,
                        username: currentUser.username,
                        avatar: currentUser.avatar,
                        role: currentUser.role,
                        isOnline: currentUser.isOnline,
                        lastSeen: currentUser.lastSeen
                    },
                    {
                        userId: recipient.id,
                        username: recipient.username,
                        avatar: recipient.avatar,
                        role: recipient.role,
                        isOnline: recipient.isOnline,
                        lastSeen: recipient.lastSeen
                    }
                ],
                lastMessage: content,
                lastMessageAt: Date.now(),
                lastMessageSenderId: currentUser.id,
                unreadCount: { [recipientId]: 1, [currentUser.id]: 0 },
                isPaid: false,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            conversations.push(conversation);
        } else {
            // Update existing
            conversation.lastMessage = content;
            conversation.lastMessageAt = Date.now();
            conversation.lastMessageSenderId = currentUser.id;
            conversation.unreadCount[recipientId] = (conversation.unreadCount[recipientId] || 0) + 1;
        }

        const newMessage: Message = {
            id: generateId('msg'),
            conversationId: conversation.id,
            senderId: currentUser.id,
            senderUsername: currentUser.username,
            senderAvatar: currentUser.avatar,
            recipientId: recipientId,
            recipientUsername: conversation.participantDetails.find(p => p.userId === recipientId)?.username || 'User',
            type,
            content,
            isRead: false,
            createdAt: Date.now()
        };

        messages.push(newMessage);

        // Notify recipient
        this._createNotification(recipientId, 'new_message', `New message from ${currentUser.displayName}`, `/messages/${conversation.id}`);

        return newMessage;
    },


    // =========================================================================
    // INTERNAL HELPERS
    // =========================================================================

    _updateUserInStore(user: User) {
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        }
    },

    _createNotification(userId: string, type: any, content: string, actionUrl: string) {
        const notif: Notification = {
            id: generateId('notif'),
            userId,
            type,
            fromUserId: currentUser?.id || 'system',
            fromUsername: currentUser?.displayName || 'System',
            fromAvatar: currentUser?.avatar || '',
            content,
            actionUrl,
            isRead: false,
            createdAt: Date.now()
        };
        notifications.unshift(notif);
    },

    _setCookie(name: string, value: string, maxAge?: number) {
        let cookie = `${name}=${value}; path=/;`;
        if (maxAge) cookie += ` max-age=${maxAge};`;
        document.cookie = cookie;
    },

    _getCookie(name: string): string | undefined {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, val] = cookie.trim().split('=');
            if (key === name) return val;
        }
        return undefined;
    },

    _deleteCookie(name: string) {
        document.cookie = `${name}=; max-age=0; path=/;`;
    },

    // Debugging access
    _getDb() {
        return { users, posts, messages, conversations, notifications };
    }
};

// Expose to window for debugging
if (typeof window !== 'undefined') {
    (window as any).__MOCK_SERVICE__ = MockService;
}
