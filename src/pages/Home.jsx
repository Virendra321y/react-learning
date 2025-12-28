import React from 'react';
import { motion } from 'framer-motion';
import WeatherWidget from '../components/Home/WeatherWidget';
import NewsWidget from '../components/Home/NewsWidget';
import StockWidget from '../components/Home/StockWidget';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] overflow-x-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse decoration-1000" />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Hero & Main Content */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold tracking-wide uppercase">
                                Welcome to the next generation
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight mb-8">
                                Connect, Share <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                                    & Evolve.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 font-medium max-w-xl mb-10 leading-relaxed">
                                Join our thriving community of learners and creators. Share your journey, get inspired, and build the future together.
                            </p>

                            <div className="flex flex-wrap gap-6 mb-16">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-purple-500/20 flex items-center gap-3 group transition-all"
                                >
                                    Get Started
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10 backdrop-blur-sm transition-all"
                                >
                                    Learn More
                                </motion.button>
                            </div>

                            {/* Main Display Area (Placeholder for featured content) */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full aspect-video rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl relative group"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-lg border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                                            <svg className="w-10 h-10 text-white translate-l-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-white font-bold tracking-widest uppercase text-sm">Watch Introduction</p>
                                    </div>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072"
                                    className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                                    alt="Platform Preview"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="lg:col-span-4 space-y-8">
                        <WeatherWidget />
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
                    <p className="text-slate-500 font-medium">
                        © 2025 SocialApp. Empowering creators worldwide.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;

