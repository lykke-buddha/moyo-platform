'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signup } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
                alert('Successfully Logged In! Welcome back.');
                onClose();
            } else {
                await signup(email, password);
                alert('Account created! Please check your email to confirm.');
                onClose();
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden cursor-default">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                    <span className="iconify" data-icon="lucide:x" data-width="20"></span>
                </button>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                        <span className="iconify text-white" data-icon="lucide:heart-handshake" data-width="24"></span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-zinc-500 text-sm">Join the exclusive community of African creators.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-zinc-500 iconify" data-icon="lucide:mail" data-width="16"></span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-zinc-500 iconify" data-icon="lucide:lock" data-width="16"></span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="flex items-center gap-2">
                            <input type="checkbox" required id="terms" className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500/50" />
                            <label htmlFor="terms" className="text-xs text-zinc-500">I agree to the <a href="#" className="text-amber-500 hover:underline">Terms of Service</a></label>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500 relative z-10">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-amber-500 hover:text-amber-400 font-medium hover:underline">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
