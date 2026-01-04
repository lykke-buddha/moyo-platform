'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/modals/LoginModal';

const CONVERSATIONS = [
    { id: 1, name: 'Zainab', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', lastMessage: 'Thanks for subscribing! ❤️', time: '2m', unread: true },
    { id: 2, name: 'Kiki__X', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', lastMessage: 'Did you see my new post?', time: '1h', unread: false },
    { id: 3, name: 'Amara', avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop', lastMessage: 'Hey! Check your DMs.', time: '3h', unread: false },
];

export default function MessagesPage() {
    const { isLoggedIn } = useAuth();
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <span className="iconify text-zinc-600" data-icon="lucide:message-circle" data-width="40"></span>
                </div>
                <h2 className="text-xl font-bold text-zinc-200 mb-2">Login to view messages</h2>
                <p className="text-zinc-500 max-w-xs mb-6">Connect with your favorite creators and chat directly with them.</p>
                <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    Log In
                </button>
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] md:h-screen overflow-hidden">
            {/* Conversations List (Sidebar on desktop, full width on mobile if no active chat) */}
            <div className={`w-full md:w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-zinc-800">
                    <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500 iconify" data-icon="lucide:search" data-width="16"></span>
                        <input type="text" placeholder="Search direct messages" className="w-full bg-zinc-900 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-200 focus:ring-1 focus:ring-amber-500" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {CONVERSATIONS.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-900/50 transition-colors ${activeChat === chat.id ? 'bg-zinc-900 border-r-2 border-amber-500' : ''}`}
                        >
                            <div className="relative">
                                <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" alt={chat.name} />
                                {chat.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-zinc-950"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className={`text-sm font-semibold truncate ${chat.unread ? 'text-zinc-100' : 'text-zinc-300'}`}>{chat.name}</h3>
                                    <span className="text-[10px] text-zinc-500">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread ? 'text-zinc-300 font-medium' : 'text-zinc-500'}`}>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col bg-zinc-950/50 relative">
                    {/* Chat Header */}
                    <div className="flex items-center p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
                        <button onClick={() => setActiveChat(null)} className="md:hidden mr-3 text-zinc-400">
                            <span className="iconify" data-icon="lucide:arrow-left" data-width="20"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <img src={CONVERSATIONS.find(c => c.id === activeChat)?.avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                            <div>
                                <h3 className="font-semibold text-zinc-200">{CONVERSATIONS.find(c => c.id === activeChat)?.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-zinc-500">Online now</span>
                                </div>
                            </div>
                        </div>
                        <button className="ml-auto text-zinc-400 hover:text-white">
                            <span className="iconify" data-icon="lucide:more-vertical" data-width="20"></span>
                        </button>
                    </div>

                    {/* Messages (Mock) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 text-zinc-300 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                                Hey! Thanks for subscribing to my premium tier. ❤️
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-amber-600/20 border border-amber-600/30 text-amber-100 p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                                Of course! Love your content. When is the next stream?
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                        <div className="flex items-center gap-3 bg-zinc-900 p-2 rounded-2xl border border-zinc-800 focus-within:ring-1 focus-within:ring-amber-500/50 focus-within:border-amber-500/50 transition-all">
                            <button className="text-zinc-500 hover:text-amber-500 p-2">
                                <span className="iconify" data-icon="lucide:plus" data-width="20"></span>
                            </button>
                            <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent text-sm text-zinc-200 focus:outline-none" />
                            <button className="bg-amber-500 text-zinc-950 p-2 rounded-xl hover:bg-amber-400 transition-colors">
                                <span className="iconify" data-icon="lucide:send" data-width="18"></span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-zinc-950/30">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                        <span className="iconify text-zinc-600" data-icon="lucide:send" data-width="40"></span>
                    </div>
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">Your Messages</h3>
                    <p className="text-zinc-500 text-sm max-w-xs">Select a conversation from the left to start chatting.</p>
                </div>
            )}
        </div>
    );
}
