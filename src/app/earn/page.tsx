export default function EarnPage() {
    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-zinc-100 mb-4">Monetize Your Content</h1>
                <p className="text-zinc-400 max-w-md mx-auto">Join thousands of creators earning a living doing what they love. Simple, transparent, and built for you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
                {[
                    { icon: 'lucide:wallet', title: 'Instant Payouts', desc: 'Get paid instantly via M-PESA or straight to your bank.' },
                    { icon: 'lucide:users', title: 'Community Growth', desc: 'Tools to help you grow and engage your audience.' },
                    { icon: 'lucide:shield-check', title: 'Secure Platform', desc: 'Your content and earnings are always protected.' },
                ].map((item) => (
                    <div key={item.title} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="iconify" data-icon={item.icon} data-width="24"></span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                        <p className="text-zinc-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to start?</h2>
                <button className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-zinc-100 transition-colors shadow-xl">
                    Apply Now
                </button>
            </div>
        </div>
    );
}
