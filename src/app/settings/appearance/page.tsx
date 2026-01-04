'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Moon, Sun, Smartphone, Check } from 'lucide-react';

export default function AppearanceSettingsPage() {
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-zinc-100">Appearance</h1>
            </div>

            <div className="space-y-8">
                {/* Theme Selection */}
                <section>
                    <h2 className="text-sm font-medium text-zinc-500 mb-4 px-1">App Theme</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Dark */}
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-800 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900'}`}
                        >
                            <div className="w-full aspect-[4/3] bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800">
                                <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-500' : 'text-zinc-600'}`} />
                            </div>
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-zinc-400'}`}>Dark</span>
                        </button>

                        {/* Light */}
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${theme === 'light' ? 'bg-zinc-100 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900'}`}
                        >
                            <div className="w-full aspect-[4/3] bg-white rounded-lg flex items-center justify-center border border-zinc-200">
                                <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-amber-500' : 'text-zinc-400'}`} />
                            </div>
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-400'}`}>Light</span>
                        </button>

                        {/* System */}
                        <button
                            onClick={() => setTheme('system')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${theme === 'system' ? 'bg-zinc-800 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900'}`}
                        >
                            <div className="w-full aspect-[4/3] bg-gradient-to-tr from-zinc-950 to-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                                <Smartphone className={`w-6 h-6 ${theme === 'system' ? 'text-amber-500' : 'text-zinc-500'}`} />
                            </div>
                            <span className={`text-sm font-medium ${theme === 'system' ? 'text-white' : 'text-zinc-400'}`}>System</span>
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-3 px-1">
                        Select a theme for your device. 'System' will follow your device settings.
                    </p>
                </section>
            </div>
        </div>
    );
}
