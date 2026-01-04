import { Heart, UserPlus, DollarSign, MessageCircle, CheckCircle2 } from 'lucide-react';

type Notification = {
    id: string;
    type: 'like' | 'follow' | 'tip' | 'comment';
    user: string;
    avatar: string;
    text: string;
    time: string;
    read: boolean;
};

export default function NotificationsPage() {
    // Mock Data
    const notifications: Notification[] = [
        { id: '1', type: 'like', user: 'Nia Art', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', text: 'liked your post', time: '2m ago', read: false },
        { id: '2', type: 'follow', user: 'Chef Jollof', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', text: 'started following you', time: '15m ago', read: false },
        { id: '3', type: 'tip', user: 'AfroBeats', avatar: 'https://images.unsplash.com/photo-1533246862916-5d82083bb78e?w=100&h=100&fit=crop', text: 'tipped you ₦5,000', time: '1h ago', read: true },
        { id: '4', type: 'comment', user: 'Zara', avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop', text: 'commented: "This is stunning! 😍"', time: '3h ago', read: true },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' };
            case 'follow': return { icon: UserPlus, color: 'text-amber-500', bg: 'bg-amber-500/10' };
            case 'tip': return { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' };
            case 'comment': return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' };
            default: return { icon: Heart, color: 'text-zinc-500', bg: 'bg-zinc-500/10' };
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-6 pb-24 px-4 min-h-screen">
            <h1 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                Notifications
                <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </h1>

            <div className="space-y-4">
                {notifications.map((notif) => {
                    const { icon: Icon, color, bg } = getIcon(notif.type);
                    return (
                        <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${notif.read ? 'bg-zinc-950/50 border-zinc-900' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                            <div className={`mt-0.5 p-2 rounded-full shrink-0 ${bg} ${color}`}>
                                <Icon className="w-5 h-5" fill={notif.type === 'like' ? 'currentColor' : 'none'} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={notif.avatar} alt={notif.user} className="w-6 h-6 rounded-full object-cover" />
                                        <p className="text-zinc-200 text-sm">
                                            <span className="font-semibold text-zinc-100 hover:text-amber-500 cursor-pointer transition-colors">{notif.user}</span> {notif.text}
                                        </p>
                                    </div>
                                    <span className="text-zinc-500 text-[10px] whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                {!notif.read && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <span className="text-amber-500 text-[10px] font-medium">New</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <button className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">Mark all as read</button>
            </div>
        </div>
    );
}
