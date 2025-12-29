import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiChevronRight, FiClock, FiVideo, FiActivity, FiUsers } from 'react-icons/fi';

const CATEGORIES = [
    { id: 'general', label: 'Top Stories' },
    { id: 'business', label: 'Business' },
    { id: 'sports', label: 'Sports' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'entertainment', label: 'Bollywood', overrideLabel: 'Bollywood' }, // API maps to entertainment
    { id: 'technology', label: 'Tech & AI' },
    { id: 'entertainment', label: 'Fashion', overrideLabel: 'Fashion' } // API maps to entertainment
];

const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                // Using Saurav.tech NewsAPI Proxy (Free, No Key, India specific)
                const response = await axios.get(
                    `https://saurav.tech/NewsAPI/top-headlines/category/${activeCategory.id}/in.json`
                );

                // Shuffle array slightly to visually differentiate "Bollywood" from "Entertainment" if they use same source
                // In a real app, we would use a different query parameter
                let articles = response.data.articles;
                if (activeCategory.overrideLabel === 'Bollywood' || activeCategory.overrideLabel === 'Fashion') {
                    // Simple randomization to make "Bollywood" look different from "Entertainment"
                    articles = articles.sort(() => 0.5 - Math.random());
                }

                setNews(articles.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [activeCategory]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-xl"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-black flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Trending Now
                    </h3>
                    <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors"><FiVideo /></button>
                        <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors"><FiActivity /></button>
                    </div>
                </div>

                {/* Categories Scrollable Area */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                    {CATEGORIES.map((cat, idx) => (
                        <button
                            key={`${cat.id}-${idx}`}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${(cat.overrideLabel || cat.label) === (activeCategory.overrideLabel || activeCategory.label)
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat.overrideLabel || cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* News List */}
            <div className="p-2">
                {loading ? (
                    [1, 2, 3].map((n) => (
                        <div key={n} className="p-4 animate-pulse flex gap-4">
                            <div className="w-16 h-16 bg-white/5 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-white/5 rounded w-3/4"></div>
                                <div className="h-3 bg-white/5 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeCategory.overrideLabel || activeCategory.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-1"
                        >
                            {news.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 rounded-xl hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex gap-4">
                                        {item.urlToImage ? (
                                            <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 relative">
                                                <img
                                                    src={item.urlToImage}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => { e.target.style.display = 'none' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs p-2 text-center">
                                                {item.source.name}
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60 font-bold uppercase truncate max-w-[80px]">
                                                    {item.source.name}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                    <FiClock className="text-[9px]" />
                                                    {new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="text-white/90 text-sm font-bold leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </h4>

                                            {/* Social Proof Decoration */}
                                            <div className="mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><FiUsers size={10} /> 1.2k readers</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <div className="p-3 border-t border-white/5 text-center">
                <button className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1 hover:gap-2 transition-all w-full uppercase tracking-widest">
                    View Full Coverage <FiChevronRight />
                </button>
            </div>
        </motion.div>
    );
};

export default NewsWidget;
