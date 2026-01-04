export default function NotificationsPage() {
    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <h1 className="text-xl font-bold text-zinc-100 mb-6">Notifications</h1>

            <div className="space-y-4">
                {[
                    { icon: 'lucide:heart', color: 'text-rose-500', bg: 'bg-rose-500/10', text: 'liked your post', user: 'Nia Art', time: '2m ago' },
                    { icon: 'lucide:user-plus', color: 'text-gold', bg: 'bg-gold/10', text: 'started following you', user: 'Chef Jollof', time: '15m ago' },
                    { icon: 'lucide:dollar-sign', color: 'text-green-500', bg: 'bg-green-500/10', text: 'tipped you $5.00', user: 'AfroBeats', time: '1h ago' },
                    { icon: 'lucide:message-circle', color: 'text-blue-500', bg: 'bg-blue-500/10', text: 'commented on your photo', user: 'Zara', time: '3h ago' },
                ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-surface-highlight hover:bg-surface-highlight/50 transition-colors">
                        <div className={`mt-0.5 p-2 rounded-full ${notif.bg} ${notif.color}`}>
                            <span className="iconify" data-icon={notif.icon} data-width="16"></span>
                        </div>
                        <div>
                            <p className="text-zinc-200 text-sm">
                                <span className="font-semibold text-zinc-100 hover:text-gold cursor-pointer transition-colors">{notif.user}</span> {notif.text}
                            </p>
                            <p className="text-foreground-muted text-xs mt-1">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
