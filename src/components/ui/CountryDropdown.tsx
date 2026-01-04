'use client';

import { useState, useRef, useEffect } from 'react';
import { africanCountries, Country } from '@/data/countries';
import { ChevronDown, Search, Check } from 'lucide-react';

interface CountryDropdownProps {
    value: Country | null;
    onChange: (country: Country) => void;
    className?: string;
}

export default function CountryDropdown({ value, onChange, className = '' }: CountryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredCountries = africanCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:border-amber-500/50 focus:outline-none transition-all hover:bg-zinc-900/50"
            >
                {value ? (
                    <span className="flex items-center gap-2">
                        <span className="text-lg">{value.flag}</span>
                        <span>{value.name}</span>
                    </span>
                ) : (
                    <span className="text-zinc-500">Select Country</span>
                )}
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-zinc-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search country..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredCountries.length === 0 ? (
                            <div className="p-4 text-center text-sm text-zinc-500">
                                No countries found
                            </div>
                        ) : (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                        onChange(country);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-800/50 transition-colors text-left"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{country.flag}</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-zinc-200">{country.name}</span>
                                            <span className="text-xs text-zinc-500">{country.currency}</span>
                                        </div>
                                    </span>
                                    {value?.code === country.code && (
                                        <Check className="w-4 h-4 text-amber-500" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
