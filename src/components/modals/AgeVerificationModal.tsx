'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Check, X } from 'lucide-react';

export default function AgeVerificationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRestricted, setIsRestricted] = useState(false);

    useEffect(() => {
        // Check if verified in session
        const hasVerified = sessionStorage.getItem('moyo_age_verified');
        if (!hasVerified) {
            setIsOpen(true);
        }
    }, []);

    const handleConfirm = () => {
        sessionStorage.setItem('moyo_age_verified', 'true');
        setIsOpen(false);
    };

    const handleDeny = () => {
        setIsRestricted(true);
    };

    if (!isOpen && !isRestricted) return null;

    if (isRestricted) {
        return (
            <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-500">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                <p className="text-zinc-400 max-w-md mb-8">
                    You must be 18 years or older to access this platform. We strictly adhere to age verification policies to ensure user safety.
                </p>
                <a href="https://google.com" className="text-amber-500 hover:underline">Leave Site</a>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                        <span className="text-2xl font-bold text-amber-500">18+</span>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-white text-center mb-3">Age Verification Required</h2>
                <p className="text-zinc-400 text-sm text-center mb-8 leading-relaxed">
                    This website contains age-restricted content. By entering, you confirm that you are at least 18 years of age.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                        I am 18 or older
                    </button>
                    <button
                        onClick={handleDeny}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        I am under 18
                    </button>
                </div>

                <p className="text-[10px] text-zinc-600 text-center mt-6">
                    By entering, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
