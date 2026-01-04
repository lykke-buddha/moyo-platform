'use client';

import { useState } from 'react';

interface PostProps {
    id: string;
    author: string;
    handle: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    isLocked?: boolean;
}

export default function PostCard({ author, handle, content, image, likes, comments, isLocked }: PostProps) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-4 mb-6 hover:border-gold/30 transition-colors">
            <div className="flex items-start space-x-3">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-700 flex-shrink-0" />

                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-white text-lg">{author}</h3>
                            <p className="text-sm text-foreground-muted">@{handle}</p>
                        </div>
                        <button onClick={() => alert('Post options menu')} className="text-foreground-muted hover:text-white">•••</button>
                    </div>

                    <p className="mt-2 text-gray-200 leading-relaxed dark:text-gray-300">
                        {content}
                    </p>

                    {isLocked ? (
                        <div className="mt-4 h-64 bg-surface-highlight rounded-xl border border-gold/20 flex flex-col items-center justify-center p-6 text-center">
                            <span className="text-4xl mb-2">🔒</span>
                            <h4 className="text-xl font-bold text-gold mb-1">Unlock this post</h4>
                            <p className="text-sm text-foreground-muted mb-4">Subscribe to see exclusive content</p>
                            <button onClick={() => alert('Please log in to subscribe!')} className="bg-gold text-black px-6 py-2 rounded-full font-bold hover:bg-gold-hover transition-colors">
                                Subscribe for MK 5,000
                            </button>
                        </div>
                    ) : image && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-white/5">
                            {/* In a real app, use next/image. For now, a styled div placeholder */}
                            <div className="h-64 bg-surface-highlight flex items-center justify-center text-foreground-muted">
                                [Image Content Placeholder]
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 text-foreground-muted">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-gold'}`}
                        >
                            <span>{isLiked ? '❤️' : '🤍'}</span>
                            <span>{likes + (isLiked ? 1 : 0)}</span>
                        </button>

                        <button className="flex items-center space-x-2 hover:text-gold transition-colors">
                            <span>💬</span>
                            <span>{comments}</span>
                        </button>

                        <button onClick={() => alert('Tip feature coming soon!')} className="flex items-center space-x-2 hover:text-gold transition-colors">
                            <span>💸</span>
                            <span>Tip</span>
                        </button>

                        <button onClick={() => alert('Share feature coming soon!')} className="flex items-center space-x-2 hover:text-gold transition-colors">
                            <span>↗️</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
