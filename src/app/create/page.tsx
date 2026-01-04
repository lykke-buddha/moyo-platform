'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function CreatePostPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            toast.error("You must be logged in to create a post");
            router.push('/');
        }
    }, [user, isLoading, router]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    const handleSubmit = async () => {
        if (!content.trim() && !imageFile) {
            toast.error("Please add some text or an image");
            return;
        }
        if (!user) {
            toast.error("You must be logged in to post");
            return;
        }

        setIsPosting(true);
        const toastId = toast.loading("Creating post...");

        try {
            let imageUrl = null;

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                console.log('Attempting upload to posts bucket:', filePath);

                const { error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(filePath, imageFile);

                if (uploadError) {
                    console.error('Upload Error:', uploadError);
                    throw new Error(`Image upload failed: ${uploadError.message}`);
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('posts')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            // 2. Insert Post
            console.log('Inserting post record...');
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    content: content,
                    image_url: imageUrl,
                    is_premium: false, // Default for now
                    price: 0
                });

            if (insertError) {
                console.error('Insert Error:', insertError);
                throw new Error(`Database insert failed: ${insertError.message}`);
            }

            toast.success("Post created successfully!", { id: toastId });
            router.push('/');
            router.refresh();

        } catch (error: any) {
            console.error('Post Creation Error:', error);
            let message = error.message || "Failed to create post";

            if (message.includes('foreign key constraint')) {
                message = "Your user profile is missing. Please go to Settings > Profile to set it up first.";
            } else if (message.includes('policy')) {
                message = "Permission denied. You may not be allowed to post.";
            }

            toast.error(message, { id: toastId });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <h1 className="text-xl font-bold text-zinc-100 mb-6">Create New Post</h1>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 relative overflow-hidden">
                        {user?.user_metadata?.avatar_url ? (
                            <Image src={user.user_metadata.avatar_url} fill className="object-cover" alt="User" />
                        ) : (
                            <div className="w-full h-full bg-zinc-700" />
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 resize-none h-32 focus:outline-none"
                        ></textarea>

                        {imagePreview && (
                            <div className="relative w-full h-64 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                                <Image src={imagePreview} fill className="object-cover" alt="Preview" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                    <div className="flex items-center gap-2 text-amber-500">
                        <button
                            onClick={() => document.getElementById('post-image-upload')?.click()}
                            className="p-2 hover:bg-amber-500/10 rounded-full transition-colors"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            id="post-image-upload"
                            hidden
                            accept="image/*"
                            onChange={handleImageSelect}
                        />
                        {/* Video/Smile buttons can be placeholders for now */}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isPosting || (!content.trim() && !imageFile)}
                        className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-medium px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
