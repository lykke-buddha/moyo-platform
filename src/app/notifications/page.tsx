import { Heart, UserPlus, DollarSign, MessageCircle } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <h1 className="text-xl font-bold text-zinc-100 mb-6">Notifications</h1>

            <div className="space-y-4">
                {[
                    { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', text: 'liked your post', user: 'Nia Art', time: '2m ago' },
                    { icon: UserPlus, color: 'text-gold', bg: 'bg-yellow-500/10 text-yellow-500', text: 'started following you', user: 'Chef Jollof', time: '15m ago' },
                    { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10', text: 'tipped you $5.00', user: 'AfroBeats', time: '1h ago' },
                    { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', text: 'commented on your photo', user: 'Zara', time: '3h ago' },
                ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                        <div className={`mt-0.5 p-2 rounded-full ${notif.bg} ${notif.color}`}>
                            <notif.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-zinc-200 text-sm">
                                <span className="font-semibold text-zinc-100 hover:text-amber-500 cursor-pointer transition-colors">{notif.user}</span> {notif.text}
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
