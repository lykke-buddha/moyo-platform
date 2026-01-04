'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Lock, Shield, Smartphone, Key, Loader2 } from 'lucide-react';

export default function SecuritySettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("New passwords don't match!");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setPasswords({ current: '', new: '', confirm: '' });
        alert('Password updated successfully!');
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-zinc-100">Password & Security</h1>
            </div>

            <div className="space-y-8">
                {/* Change Password Form */}
                <section>
                    <h2 className="text-sm font-medium text-zinc-500 mb-4 px-1 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Change Password
                    </h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 md:p-6">
                        <div className="grid gap-2">
                            <label className="text-xs text-zinc-400 font-medium">Current Password</label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs text-zinc-400 font-medium">New Password</label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs text-zinc-400 font-medium">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-600"
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* 2FA Section (Visual Only) */}
                <section>
                    <h2 className="text-sm font-medium text-zinc-500 mb-4 px-1 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Two-Factor Authentication
                    </h2>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 md:p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-zinc-200 font-medium text-sm">Text Message (SMS)</h3>
                                <p className="text-zinc-500 text-xs mt-0.5">Receive a code via SMS to sign in.</p>
                            </div>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700">
                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
