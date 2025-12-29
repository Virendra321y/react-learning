import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiLoader, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const MOCK_CONTENT = [
    {
        id: 1,
        type: 'SOCIAL',
        user: 'Bangalore Food Walks',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
        caption: "Sunday brunch at Indiranagar! The waffles here are to die for. 🧇☕ #BangaloreEats #WeekendVibes",
        likes: '1.2K',
        comments: 45
    },
    {
        id: 2,
        type: 'AD',
        brand: 'Zomatola Gold',
        title: 'Flat 50% OFF on First Order',
        desc: 'Craving Biryani? Get it delivered in 20 mins. Use Code: WELCOME50',
        cta: 'Order Now',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 3,
        type: 'SOCIAL',
        user: 'TechCrunch India',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
        caption: "Just In: India's UPI transactions hit a new record high this month! 🚀📈 #FinTech #DigitalIndia",
        likes: '5.6K',
        comments: 320
    }
];

const FINANCE_OFFERS = [
    {
        type: 'FINANCE',
        bank: 'HDFC Bank',
        cardName: 'Regalia Gold Credit Card',
        features: ['5X Reward Points', 'Complimentary Lounge Access', 'Zero Forex Markup'],
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=600',
        color: 'from-blue-900 to-indigo-900'
    },
    {
        type: 'FINANCE',
        bank: 'ICICI Bank',
        cardName: 'Amazon Pay Credit Card',
        features: ['5% Cashback on Amazon', 'Lifetime Free', 'No Cost EMI'],
        image: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=600',
        color: 'from-orange-700 to-red-900'
    },
    {
        type: 'FINANCE',
        bank: 'SBI Card',
        cardName: 'Elite Credit Card',
        features: ['Welcome Gift Worth ₹5000', 'Free Movie Tickets', 'Milestone Rewards'],
        image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600',
        color: 'from-cyan-800 to-blue-900'
    }
];

const InfiniteFeed = () => {
    const [posts, setPosts] = useState(MOCK_CONTENT);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const observerTarget = useRef(null);

    const loadMore = useCallback(() => {
        if (loading) return;
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Create new batch of posts
            const newPosts = MOCK_CONTENT.map(p => ({ ...p, id: p.id + (page * 100) }));

            // Inject a Finance Offer every page load
            const offer = FINANCE_OFFERS[(page - 1) % FINANCE_OFFERS.length];
            const offerPost = { ...offer, id: `finance-${page}` };

            // Insert offer into the batch
            const batch = [...newPosts];
            batch.splice(1, 0, offerPost); // Insert at 2nd position

            setPosts(prev => [...prev, ...batch]);
            setPage(prev => prev + 1);
            setLoading(false);
        }, 1500);
    }, [page, loading]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loadMore]);

    return (
        <div className="w-full max-w-2xl mx-auto py-8">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Live Feed
            </h3>

            <div className="space-y-8">
                {posts.map((post, index) => (
                    <motion.div
                        key={`${post.id}-${index}`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-xl"
                    >
                        {post.type === 'SOCIAL' && (
                            <>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{post.user}</h4>
                                            <p className="text-white/40 text-[10px] font-medium">2 hours ago</p>
                                        </div>
                                    </div>
                                    <FiMoreHorizontal className="text-white/40 cursor-pointer" />
                                </div>
                                {post.image && (
                                    <div className="w-full aspect-[4/3] bg-slate-900 relative">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex items-center gap-6 mb-4">
                                        <button className="flex items-center gap-2 text-white/60 hover:text-pink-500 transition-colors">
                                            <FiHeart className="text-xl" />
                                            <span className="text-xs font-bold">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-white/60 hover:text-blue-500 transition-colors">
                                            <FiMessageCircle className="text-xl" />
                                            <span className="text-xs font-bold">{post.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors ml-auto">
                                            <FiShare2 className="text-xl" />
                                        </button>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        <span className="font-bold text-white mr-2">{post.user}</span>
                                        {post.caption}
                                    </p>
                                </div>
                            </>
                        )}

                        {post.type === 'AD' && (
                            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 p-0 relative">
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black uppercase text-white/60 tracking-widest border border-white/10">Sponsored</div>
                                <div className="flex flex-col md:flex-row h-full">
                                    <div className="md:w-1/2 relative h-48 md:h-auto">
                                        <img src={post.image} alt="Ad" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6 md:w-1/2 flex flex-col justify-center">
                                        <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2">{post.brand}</p>
                                        <h3 className="text-2xl font-black text-white leading-tight mb-2">{post.title}</h3>
                                        <p className="text-white/60 text-sm font-medium mb-6">{post.desc}</p>
                                        <button className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg uppercase text-xs tracking-wider">
                                            {post.cta}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {post.type === 'FINANCE' && (
                            <div className={`bg-gradient-to-r ${post.color} p-6 relative overflow-hidden`}>
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-full md:w-1/2 relative">
                                        <div className="aspect-[1.586/1] rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                            <img src={post.image} alt="Card" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                                <p className="text-white font-black uppercase tracking-widest text-lg md:text-xl">{post.bank}</p>
                                                <p className="text-white/70 text-xs font-bold">{post.cardName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FiCreditCard className="text-white/60" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Exclusive Offer</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4">Apply & Get Rewarded</h3>
                                        <ul className="space-y-2 mb-6">
                                            {post.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-white/80 font-medium">
                                                    <FiCheckCircle className="text-green-400 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="w-full py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-colors shadow-lg uppercase text-xs tracking-wider">
                                            Check Eligibility
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Loading Sentinel */}
            <div ref={observerTarget} className="mt-12 flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Loading more content...</p>
                </div>
            </div>
        </div>
    );
};

export default InfiniteFeed;
