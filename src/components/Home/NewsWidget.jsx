import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi';

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
                setNews(response.data.articles.slice(0, 5));
                setLoading(false);
            } catch (err) {
                setError('Failed to load news');
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return (
        <div className="p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 animate-pulse h-80 flex items-center justify-center text-white font-medium">
            Loading News...
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all"
        >
            <div className="flex items-center gap-2 mb-6">
                <FiTrendingUp className="text-pink-400 w-6 h-6" />
                <h3 className="text-white text-xl font-bold">India Trending</h3>
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
                        className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <h4 className="text-white/90 text-sm font-medium leading-snug line-clamp-2">
                                {item.title}
                            </h4>
                            <FiArrowRight className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>
                        <p className="text-white/40 text-xs mt-2 font-medium">
                            {item.source.name} • {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                    </motion.a>
                ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white text-sm font-bold border border-white/10 hover:border-white/30 transition-all">
                View All News
            </button>
        </motion.div>
    );
};

export default NewsWidget;
