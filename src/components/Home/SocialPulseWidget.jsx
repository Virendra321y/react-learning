import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiFacebook, FiHeart, FiMessageCircle } from 'react-icons/fi';

const SOCIAL_TRENDS = [
    {
        id: 1,
        platform: 'instagram',
        user: '@priya_travels',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        content: "Hidden gems in Kerala! 🌴 #India #Travel",
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=300',
        likes: '45.2K',
        comments: '1.2K'
    },
    {
        id: 2,
        platform: 'facebook',
        user: 'Tech Insider India',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
        content: "Top 5 Smartphones launching this Diwali 📱💥",
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300',
        likes: '12K',
        comments: '850'
    },
    {
        id: 3,
        platform: 'instagram',
        user: '@foodie_delhi',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        content: "Best Chole Bhature in town! 🍲😋",
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300',
        likes: '89K',
        comments: '3.4K'
    }
];

const SocialPulseWidget = () => {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        Social Pulse
                    </h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Live from India</p>
                </div>
            </div>

            <div className="space-y-4">
                {SOCIAL_TRENDS.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${post.platform === 'instagram' ? 'from-yellow-400 via-red-500 to-purple-500' : 'from-blue-600 to-blue-400'} p-[2px]`}>
                                    <div className="w-full h-full bg-slate-900 rounded-full border-2 border-slate-900" />
                                </div>
                                <img src={post.avatar} alt={post.user} className="relative z-10 w-10 h-10 rounded-full object-cover border-2 border-slate-900" />
                                <div className="absolute -bottom-1 -right-1 bg-white text-slate-900 rounded-full p-0.5 text-[10px]">
                                    {post.platform === 'instagram' ? <FiInstagram /> : <FiFacebook />}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-white text-xs font-bold">{post.user}</h4>
                                <p className="text-white/40 text-[10px] items-center gap-1 hidden group-hover:flex">
                                    View Profile
                                </p>
                            </div>
                        </div>

                        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                            <img src={post.image} alt="Content" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                <p className="text-white text-xs font-medium line-clamp-2">{post.content}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-white/50 text-[10px] font-bold">
                            <div className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                                <FiHeart /> {post.likes}
                            </div>
                            <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                <FiMessageCircle /> {post.comments}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <button className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:text-blue-300 transition-colors">
                    Load More Trends
                </button>
            </div>
        </div>
    );
};

export default SocialPulseWidget;
