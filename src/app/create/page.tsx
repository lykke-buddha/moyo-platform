export default function CreatePostPage() {
    return (
        <div className="max-w-2xl mx-auto pt-6 pb-20 px-4">
            <h1 className="text-xl font-bold text-zinc-100 mb-6">Create New Post</h1>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0">
                        {/* User Avatar Placeholder */}
                    </div>
                    <textarea
                        placeholder="What's on your mind?"
                        className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 resize-none h-32 focus:outline-none"
                    ></textarea>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                    <div className="flex items-center gap-2 text-amber-500">
                        <button className="p-2 hover:bg-amber-500/10 rounded-full transition-colors">
                            <span className="iconify" data-icon="lucide:image" data-width="20"></span>
                        </button>
                        <button className="p-2 hover:bg-amber-500/10 rounded-full transition-colors">
                            <span className="iconify" data-icon="lucide:video" data-width="20"></span>
                        </button>
                        <button className="p-2 hover:bg-amber-500/10 rounded-full transition-colors">
                            <span className="iconify" data-icon="lucide:smile" data-width="20"></span>
                        </button>
                    </div>

                    <button className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-medium px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all">
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
