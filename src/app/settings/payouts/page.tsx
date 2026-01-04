'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function PayoutsSettingsPage() {
    const [cards, setCards] = useState([
        { id: '1', type: 'Visa', last4: '4242', isDefault: true, expiry: '12/25' },
        { id: '2', type: 'Mastercard', last4: '8833', isDefault: false, expiry: '09/24' }
    ]);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this card?')) {
            setCards(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSetDefault = (id: string) => {
        setCards(prev => prev.map(c => ({
            ...c,
            isDefault: c.id === id
        })));
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/settings" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-zinc-100">Payment Methods</h1>
            </div>

            <div className="space-y-6">
                {/* Cards List */}
                <div className="space-y-4">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className={`relative p-5 rounded-2xl border transition-all ${card.isDefault ? 'bg-zinc-900/80 border-amber-500/50 ring-1 ring-amber-500/20' : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-700">
                                        {card.type}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-zinc-200 font-medium">•••• •••• •••• {card.last4}</p>
                                            {card.isDefault && (
                                                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-1">Expires {card.expiry}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!card.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(card.id)}
                                            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors text-xs"
                                        >
                                            Make Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Card Button */}
                <button className="w-full py-4 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Add Payment Method
                </button>

                <p className="text-xs text-center text-zinc-600 px-4">
                    Your payment information is securely stored and encrypted.
                    We never store your full card number.
                </p>
            </div>
        </div>
    );
}
