'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';
import CountryDropdown from '../ui/CountryDropdown';
import { Country } from '@/data/countries';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [view, setView] = useState<AuthView>('LOGIN');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<UserRole>('fan');
    const [rememberMe, setRememberMe] = useState(false);

    // DOB State
    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');

    // Country State
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    const { login, signup } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Processing...");

        try {
            if (view === 'LOGIN') {
                await login(email, password, rememberMe);
                toast.success('Welcome back!', { id: toastId });
                onClose();
            } else if (view === 'SIGNUP') {
                // Validation
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (username.length < 3) {
                    throw new Error("Username must be at least 3 characters");
                }

                // DOB Validation
                if (!dobDay || !dobMonth || !dobYear) {
                    throw new Error("Date of Birth is required");
                }

                const day = parseInt(dobDay);
                const month = parseInt(dobMonth);
                const year = parseInt(dobYear);

                // Helper to validate valid day/month
                const isValidDate = (d: number, m: number, y: number) => {
                    const date = new Date(y, m - 1, d);
                    return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y;
                };

                if (!isValidDate(day, month, year)) {
                    throw new Error("Invalid Date of Birth");
                }

                // Country Validation
                if (!selectedCountry) {
                    throw new Error("Please select your country of residence");
                }

                await signup(email, password, username, role, { day, month, year }, {
                    name: selectedCountry.name,
                    code: selectedCountry.code,
                    flag: selectedCountry.flag
                });
                toast.success('Account created successfully!', { id: toastId });
                onClose();
            } else if (view === 'FORGOT_PASSWORD') {
                // Mock password reset
                await new Promise(r => setTimeout(r, 1000));
                toast.success(`Password reset link sent to ${email}`, { id: toastId });
                setView('LOGIN');
            }
        } catch (error) {
            console.error("Auth error:", error);
            if (error instanceof Error) {
                toast.error(error.message, { id: toastId });
            } else {
                toast.error('An error occurred', { id: toastId });
            }
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className={`bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden cursor-default transition-all duration-300 ${view === 'SIGNUP' ? 'h-auto max-h-[90vh] overflow-y-auto no-scrollbar' : ''}`}>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-20">
                    <span className="iconify" data-icon="lucide:x" data-width="20"></span>
                </button>

                <div className="text-center mb-6 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                        <span className="iconify text-white" data-icon="lucide:heart-handshake" data-width="24"></span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {view === 'LOGIN' && 'Welcome Back'}
                        {view === 'SIGNUP' && 'Create Account'}
                        {view === 'FORGOT_PASSWORD' && 'Reset Password'}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        {view === 'FORGOT_PASSWORD' ? 'Enter your email to receive a reset link.' : 'Join the exclusive community of African creators.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    {/* Role Selection for Signup */}
                    {view === 'SIGNUP' && (
                        <div className="flex bg-zinc-950 p-1 rounded-lg mb-4 border border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setRole('fan')}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${role === 'fan' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Fan
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('creator')}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${role === 'creator' ? 'bg-amber-600/20 text-amber-500 shadow-sm border border-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Creator
                            </button>
                        </div>
                    )}

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

                    {view === 'SIGNUP' && (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400 ml-1">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-zinc-500 iconify" data-icon="lucide:user" data-width="16"></span>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="username"
                                        minLength={3}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>

                            {/* DOB */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400 ml-1">Date of Birth</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        required
                                        placeholder="DD"
                                        min={1} max={31}
                                        value={dobDay}
                                        onChange={(e) => setDobDay(e.target.value)}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none transition-all placeholder:text-zinc-600 text-center"
                                    />
                                    <input
                                        type="number"
                                        required
                                        placeholder="MM"
                                        min={1} max={12}
                                        value={dobMonth}
                                        onChange={(e) => setDobMonth(e.target.value)}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none transition-all placeholder:text-zinc-600 text-center"
                                    />
                                    <input
                                        type="number"
                                        required
                                        placeholder="YYYY"
                                        min={1900} max={new Date().getFullYear()}
                                        value={dobYear}
                                        onChange={(e) => setDobYear(e.target.value)}
                                        className="w-[1.5fr] bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none transition-all placeholder:text-zinc-600 text-center"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500 ml-1">Must be 18+ to join</p>
                            </div>

                            {/* Country Dropdown */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-400 ml-1">Country</label>
                                <CountryDropdown
                                    value={selectedCountry}
                                    onChange={setSelectedCountry}
                                />
                            </div>
                        </>
                    )}

                    {view !== 'FORGOT_PASSWORD' && (
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
                                    minLength={8}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                            {view === 'SIGNUP' && <p className="text-[10px] text-zinc-500 ml-1">Min 8 chars, uppercase, lowercase, number</p>}
                        </div>
                    )}

                    {view === 'SIGNUP' && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Confirm Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-zinc-500 iconify" data-icon="lucide:lock" data-width="16"></span>
                                <input
                                    type="password"
                                    required={view === 'SIGNUP'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>
                    )}

                    {view === 'LOGIN' && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500/50"
                                />
                                <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer">Remember me</label>
                            </div>
                            <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-xs text-amber-500 hover:text-amber-400 hover:underline">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    {view === 'SIGNUP' && (
                        <div className="flex items-center gap-2">
                            <input type="checkbox" required id="terms" className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500/50" />
                            <label htmlFor="terms" className="text-xs text-zinc-500">I agree to the <a href="#" className="text-amber-500 hover:underline">Terms of Service</a></label>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {view === 'LOGIN' ? 'Sign In' : (view === 'SIGNUP' ? 'Create Account' : 'Send Reset Link')}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500 relative z-10">
                    {view === 'LOGIN' && (
                        <>
                            Don't have an account?{' '}
                            <button onClick={() => setView('SIGNUP')} className="text-amber-500 hover:text-amber-400 font-medium hover:underline">
                                Sign up
                            </button>
                        </>
                    )}
                    {view === 'SIGNUP' && (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => setView('LOGIN')} className="text-amber-500 hover:text-amber-400 font-medium hover:underline">
                                Sign in
                            </button>
                        </>
                    )}
                    {view === 'FORGOT_PASSWORD' && (
                        <button onClick={() => setView('LOGIN')} className="text-zinc-400 hover:text-white font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                            <span className="iconify" data-icon="lucide:arrow-left" data-width="14"></span>
                            Back to Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
