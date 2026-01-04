
'use client';

import { useState } from 'react';
import { seedUsers } from '@/utils/seedData';
import Link from 'next/link';

export default function SeedPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const handleSeed = async () => {
        setIsLoading(true);
        setLogs(['Starting seed process...']);
        try {
            const newLogs = await seedUsers();
            setLogs(prev => [...prev, ...newLogs, 'Done!']);
        } catch (error: any) {
            setLogs(prev => [...prev, `Critical Error: ${error.message}`]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-amber-500">Database Seeder</h1>
                    <Link href="/" className="text-sm underline text-zinc-500 hover:text-white">Back to App</Link>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <p className="text-zinc-400 mb-6">
                        This tool will create user accounts for the mock profiles (Zainab, Kiki, etc.) using the Supabase Client.
                        It attempts to Sign Up each user. If they already exist, it may fail to log them in to create posts unless you are authenticated as them.
                        <br /><br />
                        <strong>Note:</strong> Since we don't have the service role key, this only works well for fresh user creation or if email confirmation is disabled.
                    </p>

                    <button
                        onClick={handleSeed}
                        disabled={isLoading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Seeding...' : 'Run Seed Script'}
                    </button>
                </div>

                <div className="bg-black border border-zinc-800 p-4 rounded-xl min-h-[300px] overflow-y-auto font-mono text-xs">
                    {logs.length === 0 ? (
                        <span className="text-zinc-600">Waiting for output...</span>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className="mb-1 border-b border-zinc-900/50 pb-1 last:border-0">{log}</div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
