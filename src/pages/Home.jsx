import React from 'react';
import { motion } from 'framer-motion';
import NewsWidget from '../components/Home/NewsWidget';
import StockWidget from '../components/Home/StockWidget';
import AdCampaignWidget from '../components/Home/AdCampaignWidget';
import SocialPulseWidget from '../components/Home/SocialPulseWidget';
import LocalEventsWidget from '../components/Home/LocalEventsWidget';
import DateTimeHeader from '../components/Home/DateTimeHeader';
import InfiniteFeed from '../components/Home/InfiniteFeed';
import { FiZap, FiAward, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] overflow-x-hidden pb-20 font-sans text-slate-300">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[130px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse decoration-1000" />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-pink-600/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 py-8">

                {/* 1. Dynamic Date & Time Header */}
                <DateTimeHeader />

                {/* Top Section: Hero & Key Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Hero Content */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-xs font-black tracking-widest uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                #1 Learning & Social Platform in India
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                                The Future of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                                    Digital India
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 font-medium max-w-xl mb-10 leading-relaxed">
                                Join 10M+ users discovering real-time trends, air quality insights, and market opportunities. Your gateway to the smart web.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-16">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3.5 bg-white text-slate-900 rounded-full font-black flex items-center gap-3 transition-all uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                                >
                                    Get Started Free
                                    <FiZap />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="px-8 py-3.5 bg-white/5 text-white rounded-full font-bold border border-white/10 hover:bg-white/10 transition-all text-xs uppercase tracking-wider backdrop-blur-sm"
                                >
                                    Explore Dashboard
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Hero Widget Stack */}
                    <div className="lg:col-span-4 space-y-6">
                        <StockWidget />
                        <AdCampaignWidget />
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* Left Column: Viral Content & Social */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Featured News Ticker Section */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <div className="flex items-end justify-between mb-6">
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <FiTrendingUp className="text-pink-500" />
                                        <span>Trending Now</span>
                                    </h2>
                                    <span className="text-xs font-bold text-blue-400 cursor-pointer hover:underline uppercase tracking-widest">View All Trends</span>
                                </div>
                            </div>
                            {/* News Widget takes prominent space */}
                            <div>
                                <NewsWidget />
                            </div>
                        </div>

                        {/* Visual Stories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 border border-white/10 group cursor-pointer shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000"
                                    alt="Trending 1"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 p-6 z-20">
                                    <span className="bg-purple-600 text-[9px] font-black px-2 py-1 rounded mb-2 inline-block text-white uppercase tracking-widest">Featured</span>
                                    <h3 className="text-white text-lg font-black leading-tight">The Rise of Indie Creators in Tier-2 Cities</h3>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 border border-white/10 group cursor-pointer shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000"
                                    alt="Trending 2"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 p-6 z-20">
                                    <span className="bg-blue-600 text-[9px] font-black px-2 py-1 rounded mb-2 inline-block text-white uppercase tracking-widest">Technology</span>
                                    <h3 className="text-white text-lg font-black leading-tight">Web3 Adoption Surges in Indian Metros</h3>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Utilities & Social */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Local Events Widget - New Addition */}
                        <LocalEventsWidget />

                        <SocialPulseWidget />

                        {/* Secondary Partner Slot */}
                        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative group cursor-pointer">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full transform translate-x-10 -translate-y-10" />
                            <div className="relative z-10 text-center">
                                <div className="inline-block p-3 rounded-full bg-white/20 mb-3 backdrop-blur-md">
                                    <FiAward className="text-white text-xl" />
                                </div>
                                <h3 className="text-white font-black text-xl mb-1">Premium Partner</h3>
                                <p className="text-white/80 text-xs font-medium mb-4">Unlock exclusive tools for content creators.</p>
                                <button className="w-full py-3 bg-white text-purple-700 font-black text-xs rounded-xl uppercase tracking-widest hover:bg-white/90 transition-colors shadow-lg">
                                    Claim Offer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Infinite Feed Section */}
                <div className="border-t border-white/5 pt-12">
                    <InfiniteFeed />
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 pt-12 border-t border-white/5 text-center"
                >
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
                        © 2025 SocialApp • Empowering the Creator Economy.
                    </p>
                    <div className="flex justify-center gap-6 mt-4 opacity-50">
                        {['Privacy', 'Terms', 'Advertise', 'Partners'].map(item => (
                            <a key={item} href="#" className="text-[10px] text-white hover:text-blue-400 uppercase font-bold tracking-widest hover:underline decoration-blue-500 underline-offset-4 transition-all">
                                {item}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
