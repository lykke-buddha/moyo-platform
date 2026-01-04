'use client';

import { useState } from 'react';
import { X, CreditCard, CheckCircle2, PawPrint, Smartphone, Loader2, ShieldCheck } from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    creatorName: string;
    price: string;
    onSuccess: () => void;
}

export default function SubscriptionModal({ isOpen, onClose, creatorName, price, onSuccess }: SubscriptionModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paws' | 'transfer'>('card');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const handlePayment = () => {
        setPhoneNumberError('');

        if (paymentMethod === 'paws') {
            if (!phoneNumber) {
                setPhoneNumberError('Phone number is required for Paws Pay.');
                return;
            }
            // Basic Malawi phone validation (simple check for now)
            if (!phoneNumber.startsWith('+265') && !phoneNumber.startsWith('0')) {
                setPhoneNumberError('Please enter a valid phone number (e.g., 099... or +265...)');
                return;
            }
        }

        setProcessing(true);
        // Simulate payment delay
        setTimeout(() => {
            setProcessing(false);
            onSuccess();
            // onClose(); // onSuccess logic in Feed usually closes it, but let's be safe or let Feed handle it.
            // Feed.tsx: handleSubscriptionSuccess sets isOpen: false. So this is fine.
            const successMsg = paymentMethod === 'paws'
                ? `Paws Pay Payment Successful! Check your phone for approval prompt.`
                : `Payment Successful! You are now subscribed to ${creatorName}.`;
            alert(successMsg);
        }, 1500);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative cursor-default">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10">
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="bg-zinc-950 p-6 border-b border-zinc-800/50 text-center">
                    <h3 className="text-white font-bold text-lg mb-1">Subscribe to {creatorName}</h3>
                    <p className="text-amber-500 font-semibold text-xl">{price}<span className="text-zinc-500 text-sm font-normal"> / month</span></p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-xs text-zinc-400 mb-4 font-medium uppercase tracking-wider">Select Payment Method</p>

                    <div className="space-y-2 mb-6">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm font-medium">Pay with Card</span>
                            {paymentMethod === 'card' && <CheckCircle2 className="w-4.5 h-4.5 ml-auto" />}
                        </button>

                        <button
                            onClick={() => setPaymentMethod('paws')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'paws' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                        >
                            <PawPrint className="w-5 h-5" />
                            <span className="text-sm font-medium">Mobile Money</span>
                            {paymentMethod === 'paws' && <CheckCircle2 className="w-4.5 h-4.5 ml-auto" />}
                        </button>

                        {paymentMethod === 'paws' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-xs text-zinc-400 mb-1.5 ml-1">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="099 123 4567"
                                        className={`w-full bg-zinc-900 border ${phoneNumberError ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-amber-500'} rounded-xl p-3 text-white text-sm outline-none transition-all placeholder:text-zinc-600`}
                                    />
                                    <Smartphone className="absolute right-3 top-3 text-zinc-500 w-4.5 h-4.5" />
                                </div>
                                {phoneNumberError && <p className="text-red-500 text-xs mt-1.5 ml-1">{phoneNumberError}</p>}
                                <p className="text-[10px] text-zinc-500 mt-2 ml-1">
                                    Enter your registered mobile money number. You will receive a prompt to approve the transaction.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-3 mb-6 flex items-start gap-2 border border-zinc-800/50">
                        <ShieldCheck className="text-zinc-500 w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                            Payments are secure and encrypted. Cancel anytime from your settings. You will be charged immediately.
                        </p>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Pay ${price}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
