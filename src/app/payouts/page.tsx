export default function PayoutsPage() {
    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <h1 className="text-xl font-bold text-zinc-100 mb-6">Payouts</h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-surface to-surface-highlight rounded-2xl p-6 mb-8 border border-surface-highlight relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <p className="text-foreground-muted text-sm font-medium mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold text-white mb-6">MK 1,240,500</h2>

                <div className="flex gap-3">
                    <button className="flex-1 bg-gold text-zinc-950 font-bold py-2.5 rounded-lg text-sm hover:bg-gold-hover transition-colors shadow-lg shadow-gold/10">
                        Withdraw
                    </button>
                    <button className="flex-1 bg-surface-highlight text-zinc-200 font-medium py-2.5 rounded-lg text-sm border border-zinc-700 hover:bg-zinc-700 transition-colors">
                        View History
                    </button>
                </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground-muted mb-4 uppercase tracking-wider">Recent Transactions</h3>
            <div className="space-y-3">
                {[
                    { type: 'Subscription', amount: '+MK 4,990', user: 'John Doe', date: 'Oct 24' },
                    { type: 'Tip', amount: '+MK 10,000', user: 'Sarah Smith', date: 'Oct 23' },
                    { type: 'Withdrawal', amount: '-MK 520,000', user: 'Bank Transfer', date: 'Oct 20', negative: true },
                    { type: 'Subscription', amount: '+MK 4,990', user: 'Mike Ross', date: 'Oct 19' },
                ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-surface-highlight hover:bg-surface-highlight/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.negative ? 'bg-surface-highlight text-foreground-muted' : 'bg-green-500/10 text-green-500'}`}>
                                <span className="iconify" data-icon={tx.negative ? 'lucide:arrow-up-right' : 'lucide:arrow-down-left'} data-width="18"></span>
                            </div>
                            <div>
                                <p className="text-zinc-200 text-sm font-medium">{tx.type}</p>
                                <p className="text-foreground-muted text-xs">{tx.user} • {tx.date}</p>
                            </div>
                        </div>
                        <span className={`font-medium text-sm ${tx.negative ? 'text-zinc-200' : 'text-green-500'}`}>{tx.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
