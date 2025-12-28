import React from 'react';
import { motion } from 'framer-motion';
import AQIWidget from '../components/Home/AQIWidget';
import NewsWidget from '../components/Home/NewsWidget';
import StockWidget from '../components/Home/StockWidget';
import { FiExternalLink, FiDollarSign, FiZap, FiAward } from 'react-icons/fi';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] overflow-x-hidden pb-20">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse decoration-1000" />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Hero & Main Content */}
                    <div className="lg:col-span-8 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-sm font-black tracking-widest uppercase">
                                ⚡ Trending Now in India
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight mb-8">
                                Connect, Share <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                                    & Evolve.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 font-medium max-w-xl mb-10 leading-relaxed">
                                Join the most vibrant community where every share matters. Discover local air quality, top trending stories, and build your digital wealth.
                            </p>

                            <div className="flex flex-wrap gap-6 mb-16">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-purple-500/20 flex items-center gap-3 group transition-all uppercase tracking-widest text-sm"
                                >
                                    Get Started
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10 backdrop-blur-sm transition-all text-sm uppercase tracking-widest"
                                >
                                    Explore Trends
                                </motion.button>
                            </div>

                            {/* Featured Trending Carousel Placeholder */}
                            <div className="mb-12">
                                <div className="flex justify-between items-end mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <FiZap className="text-yellow-400" /> Viral Stories
                                    </h2>
                                    <span className="text-xs font-bold text-blue-400 cursor-pointer hover:underline uppercase tracking-widest">View Heatmap</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-800 border border-white/10 group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                                        <img
                                            src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1000"
                                            alt="Trending 1"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                                        />
                                        <div className="absolute bottom-0 left-0 p-6 z-20">
                                            <span className="bg-pink-600 text-[10px] font-black px-2 py-1 rounded mb-2 inline-block text-white uppercase tracking-widest">Global Event</span>
                                            <h3 className="text-white text-xl font-black leading-tight">Future of Decentralized Social Networks in 2026</h3>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-800 border border-white/10 group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                                        <img
                                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
                                            alt="Trending 2"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                                        />
                                        <div className="absolute bottom-0 left-0 p-6 z-20">
                                            <span className="bg-blue-600 text-[10px] font-black px-2 py-1 rounded mb-2 inline-block text-white uppercase tracking-widest">Tech News</span>
                                            <h3 className="text-white text-xl font-black leading-tight">New Indian Startup Ecosystem Reaches Record Heights</h3>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Monetization Placeholder: Inline Ad */}
                        <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-8 mb-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/[0.07] transition-all">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FiDollarSign className="text-blue-400 text-xl" />
                            </div>
                            <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Space for Partners</h4>
                            <p className="text-white/40 text-xs font-medium max-w-xs">Promote your brand here to reach thousands of Indian creators. High engagement guaranteed.</p>
                            <button className="mt-4 text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-400/30 pb-0.5 hover:text-blue-300 transition-colors">
                                Become a Sponsor
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="lg:col-span-4 space-y-8">
                        <AQIWidget />

                        {/* Monetization: Featured Partners Widget */}
                        <div className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 blur-2xl rounded-full" />
                            <div className="flex items-center gap-2 mb-4">
                                <FiAward className="text-yellow-400" />
                                <h3 className="text-white text-sm font-black uppercase tracking-widest">Premier Deals</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded bg-slate-700 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-white text-xs font-bold leading-tight line-clamp-1">Bluehost India Offer</p>
                                        <p className="text-[10px] text-white/40 uppercase font-black">70% OFF Hosting</p>
                                    </div>
                                    <FiExternalLink className="text-white/30" />
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="w-10 h-10 rounded bg-slate-700 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-white text-xs font-bold leading-tight line-clamp-1">Canva Pro - Indian Student Plan</p>
                                        <p className="text-[10px] text-white/40 uppercase font-black">Limited Time Price</p>
                                    </div>
                                    <FiExternalLink className="text-white/30" />
                                </div>
                            </div>
                            <p className="mt-4 text-[9px] text-center text-white/30 font-bold uppercase tracking-tighter">Affiliate Disclosure: Some links may earn us commissions</p>
                        </div>

                        <NewsWidget />
                        <StockWidget />
                    </div>
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 pt-12 border-t border-white/10 text-center"
                >
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
                        © 2025 SocialApp • Built for the Indian Digital Economy.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;


