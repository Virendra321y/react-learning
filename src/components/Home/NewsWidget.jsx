import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiArrowRight, FiActivity, FiShare2 } from 'react-icons/fi';

const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetching top headlines for India
                const response = await axios.get(
                    'https://saurav.tech/NewsAPI/top-headlines/category/general/in.json'
                );
                // Mix in some randomization for "trending" feel
                const articles = response.data.articles
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
                setNews(articles);
                setLoading(false);
            } catch (err) {
                setError('Failed to load trends');
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return (
        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-pulse h-96 flex items-center justify-center text-white/60 font-medium">
            Discovering Trends...
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <FiActivity className="text-pink-400 w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold">Trending in India</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Real-time social pulse</p>
                    </div>
                </div>
                <div className="flex items-center -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-[#1e293b] bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                        +
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {news.map((item, index) => (
                    <motion.a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                    >
                        <div className="flex gap-4 relative z-10">
                            {item.urlToImage && (
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                    <img src={item.urlToImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase tracking-tighter">
                                        #HOT
                                    </span>
                                    <span className="text-[10px] text-white/40 font-medium">
                                        {item.source.name}
                                    </span>
                                </div>
                                <h4 className="text-white/90 text-sm font-bold leading-tight line-clamp-2 group-hover:text-white transition-colors">
                                    {item.title}
                                </h4>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold">
                                <span>{new Date(item.publishedAt).getHours()}h ago</span>
                                <span className="flex items-center gap-1"><FiShare2 size={10} /> 2.4k</span>
                            </div>
                            <FiArrowRight className="text-white/30 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.a>
                ))}
            </div>

            <button className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 text-white text-xs font-black border border-white/10 hover:border-white/30 transition-all uppercase tracking-widest shadow-lg active:scale-95">
                Join the conversation
            </button>
        </motion.div>
    );
};

export default NewsWidget;

