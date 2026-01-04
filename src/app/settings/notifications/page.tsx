'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bell, Mail, Smartphone } from 'lucide-react';

export default function NotificationSettingsPage() {
    const [settings, setSettings] = useState({
        push: {
            likes: true,
            comments: true,
            newFollowers: true,
            mentions: true,
        },
        email: {
            marketing: false,
            security: true,
            newsletters: true,
        }
    });

    const toggle = (category: 'push' | 'email', key: string) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                // @ts-ignore
                [key]: !prev[category][key]
            }
        }));
    };

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-zinc-700'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-zinc-100">Notifications</h1>
            </div>

            <div className="space-y-8">
                {/* Push Notifications */}
                <section>
                    <h2 className="text-sm font-medium text-zinc-500 mb-4 px-1 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Push Notifications
                    </h2>
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-zinc-200">Likes</span>
                            <ToggleSwitch checked={settings.push.likes} onChange={() => toggle('push', 'likes')} />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-zinc-200">Comments</span>
                            <ToggleSwitch checked={settings.push.comments} onChange={() => toggle('push', 'comments')} />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-zinc-200">New Followers</span>
                            <ToggleSwitch checked={settings.push.newFollowers} onChange={() => toggle('push', 'newFollowers')} />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-zinc-200">Mentions & Tags</span>
                            <ToggleSwitch checked={settings.push.mentions} onChange={() => toggle('push', 'mentions')} />
                        </div>
                    </div>
                </section>

                {/* Email Notifications */}
                <section>
                    <h2 className="text-sm font-medium text-zinc-500 mb-4 px-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Notifications
                    </h2>
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-200">Security Alerts</p>
                                <p className="text-[10px] text-zinc-500">Logins from new devices</p>
                            </div>
                            <ToggleSwitch checked={settings.email.security} onChange={() => toggle('email', 'security')} />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-zinc-200">Marketing & Promos</span>
                            <ToggleSwitch checked={settings.email.marketing} onChange={() => toggle('email', 'marketing')} />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-zinc-200">Weekly Digest</span>
                            <ToggleSwitch checked={settings.email.newsletters} onChange={() => toggle('email', 'newsletters')} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
