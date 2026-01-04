'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    User, Lock, CreditCard, Bell, Moon, Globe, ChevronRight, LogOut, Sparkles
} from 'lucide-react';

export default function SettingsPage() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const accountItems = [
        { icon: User, label: 'Personal Information', path: '/settings/profile', value: '' },
        { icon: Sparkles, label: 'Become a Creator', path: '/become-creator', value: 'Start Earning' },
        { icon: Lock, label: 'Password and Security', path: '/settings/security', value: '' },
        { icon: CreditCard, label: 'Payment Methods', path: '/settings/payouts', value: 'Visa ending 4242' },
    ];

    const preferenceItems = [
        { icon: Bell, label: 'Notifications', path: '/settings/notifications', value: 'On' },
        { icon: Moon, label: 'Appearance', path: '/settings/appearance', value: 'System' },
        { icon: Globe, label: 'Language', path: '/settings/language', value: 'English (US)' },
    ];

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <h1 className="text-xl font-bold text-zinc-100 mb-6">Settings</h1>

            <div className="space-y-6">
                {/* Account Section */}
                <div>
                    <h2 className="text-sm font-medium text-zinc-500 mb-3 px-1">Account</h2>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
                        {accountItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-[18px] h-[18px] text-zinc-400 group-hover:text-zinc-300" strokeWidth={1.5} />
                                    <span className="text-zinc-200 text-sm group-hover:text-zinc-100">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.value && <span className="text-zinc-500 text-xs">{item.value}</span>}
                                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Preferences Section */}
                <div>
                    <h2 className="text-sm font-medium text-zinc-500 mb-3 px-1">Preferences</h2>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
                        {preferenceItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-[18px] h-[18px] text-zinc-400 group-hover:text-zinc-300" strokeWidth={1.5} />
                                    <span className="text-zinc-200 text-sm group-hover:text-zinc-100">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.value && <span className="text-zinc-500 text-xs">{item.value}</span>}
                                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full p-4 rounded-xl border border-red-900/30 text-red-500 hover:bg-red-950/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
