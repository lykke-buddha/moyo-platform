'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, CheckCircle2, Upload, CreditCard, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function BecomeCreatorPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    // Form State
    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    const [socialLink, setSocialLink] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'front') setIdFront(e.target.files[0]);
            else setIdBack(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);
        const toastId = toast.loading('Submitting application...');

        try {
            // In a real app, we would upload IDs to a private bucket and save the application to a DB table.
            // For this demo, we will just update the user profile to 'creator' to simulate instant approval (or pending).

            // 1. Simulate Upload
            await new Promise(r => setTimeout(r, 1500));

            // 2. Update Profile Role
            const { error } = await supabase
                .from('profiles')
                .update({
                    role: 'creator',
                    is_verified: false // Verification pending
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success('Application submitted successfully!', { id: toastId });
            router.push('/settings');

        } catch (error: any) {
            toast.error(error.message || 'Failed to submit application', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle className="w-12 h-12 text-zinc-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Login Required</h2>
                <p className="text-zinc-400">Please login to apply as a creator.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                    Become a Creator
                </h1>
                <p className="text-zinc-400 sm:text-lg">
                    Start earning specificities by sharing your explicit content.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-zinc-800 -z-10" />
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'
                            }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-500" />
                            Identity Verification
                        </h3>
                        <p className="text-sm text-zinc-400">
                            We need to verify your identity. Please upload a clear photo of your government-issued ID.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase">Front of ID</label>
                                <div
                                    onClick={() => document.getElementById('id-front')?.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${idFront ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    {idFront ? (
                                        <>
                                            <CheckCircle2 className="w-8 h-8 text-amber-500" />
                                            <span className="text-xs text-amber-200 truncate max-w-full">{idFront.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-zinc-500" />
                                            <span className="text-xs text-zinc-500">Upload Front</span>
                                        </>
                                    )}
                                </div>
                                <input id="id-front" type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'front')} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase">Back of ID</label>
                                <div
                                    onClick={() => document.getElementById('id-back')?.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${idBack ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    {idBack ? (
                                        <>
                                            <CheckCircle2 className="w-8 h-8 text-amber-500" />
                                            <span className="text-xs text-amber-200 truncate max-w-full">{idBack.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-zinc-500" />
                                            <span className="text-xs text-zinc-500">Upload Back</span>
                                        </>
                                    )}
                                </div>
                                <input id="id-back" type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'back')} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!idFront || !idBack}
                                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-500" />
                            Social Presence
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Link your existing social media profile (Instagram, Twitter, etc.) to help us verify you faster.
                        </p>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Social Media Link</label>
                            <input
                                type="url"
                                placeholder="https://instagram.com/yourname"
                                value={socialLink}
                                onChange={(e) => setSocialLink(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!socialLink}
                                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-amber-500" />
                            Payout Information
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Where should we send your earnings?
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase">Bank Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. GTBank"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase">Account Number</label>
                                <input
                                    type="text"
                                    placeholder="0123456789"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !bankName || !accountNumber}
                                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Submit Application
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
