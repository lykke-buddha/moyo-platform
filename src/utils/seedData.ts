
import { supabase } from '@/lib/supabase';
import { POSTS } from '@/lib/mockData';

// Utility to seed dummy users
// Note: This relies on the client-side supabase instance, so it simulates a user signing up regularly.

export const seedUsers = async () => {
    const authors = new Map();

    // Deduplicate authors
    POSTS.forEach(post => {
        if (!authors.has(post.author.handle)) {
            authors.set(post.author.handle, post.author);
        }
    });

    const logs: string[] = [];
    const addLog = (msg: string) => {
        console.log(msg);
        logs.push(msg);
    };

    addLog(`Found ${authors.size} unique authors to seed.`);

    for (const author of Array.from(authors.values())) {
        const email = `testuser+${author.handle.replace('@', '')}@example.com`;
        const password = 'password123';
        const username = author.handle.replace('@', '');

        addLog(`Processing: ${author.name} (${email})`);

        try {
            // 1. SignUp
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: author.name,
                        username: username,
                        avatar_url: author.avatar
                    }
                }
            });

            if (authError) {
                addLog(`  - Signup Error/Exists: ${authError.message}`);
                // If user exists, we might want to login? 
                // Simple version: just skip if exists, assuming profiles trigger ran on original creation.
            } else if (authData.user) {
                addLog(`  - User created/fetched: ${authData.user.id}`);

                // 2. Update Profile (Explicitly ensure data is there, even if trigger missed some fields like bio potentially)
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        full_name: author.name,
                        username: username,
                        avatar_url: author.avatar,
                        bio: `Official account of ${author.name}. Creating exclusive content on Moyo.`,
                        is_verified: author.isVerified || false,
                        role: 'creator'
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    addLog(`  - Profile Update Error: ${profileError.message}`);
                } else {
                    addLog(`  - Profile updated.`);
                }

                // 3. Create Posts for this author
                const authorPosts = POSTS.filter(p => p.author.handle === author.handle);
                for (const post of authorPosts) {
                    const { error: postError } = await supabase
                        .from('posts')
                        .insert({
                            user_id: authData.user.id,
                            content: post.content.text,
                            image_url: post.content.image,
                            is_premium: post.meta.isPremium,
                            price: post.lock?.price ? parseInt(post.lock.price.replace(/\D/g, '')) : 0, // crude parse
                            tags: post.content.tags || []
                        });

                    if (postError) {
                        addLog(`    - Post Error: ${postError.message}`);
                    } else {
                        addLog(`    - Post created: ${post.id.substring(0, 5)}...`);
                    }
                }
            }

        } catch (e: any) {
            addLog(`  - Unexpected error: ${e.message}`);
        }
    }

    return logs;
};
