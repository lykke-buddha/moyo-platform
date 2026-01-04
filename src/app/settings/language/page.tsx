'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Globe } from 'lucide-react';

export default function LanguageSettingsPage() {
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');

    const languages = [
        { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
        { code: 'en-UK', name: 'English (UK)', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
        { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    ];

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-zinc-100">Language</h1>
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang.code)}
                            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{lang.flag}</span>
                                <span className={`text-sm ${selectedLanguage === lang.code ? 'text-white font-medium' : 'text-zinc-400'}`}>
                                    {lang.name}
                                </span>
                            </div>
                            {selectedLanguage === lang.code && (
                                <Check className="w-5 h-5 text-amber-500" />
                            )}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-zinc-500 px-1 text-center">
                    Changes will apply across the entire application immediately.
                </p>
            </div>
        </div>
    );
}
