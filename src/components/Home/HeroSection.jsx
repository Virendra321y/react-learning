import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { IoMdRocket } from 'react-icons/io'; // Rocket icon

const HeroSection = () => {
    return (
        <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Text Content */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                            Ready to Launch?
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                        >
                            <span className="block">Launch Your Career</span>
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                To The Moon 🚀
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0"
                        >
                            Master the universe of web development. From zero gravity to full stack hero using React, Node.js, and modern tools.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                                Start Mission
                                <IoMdRocket className="ml-2 -mr-1" size={20} />
                            </button>
                            <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-200 bg-white/10 border border-white/20 rounded-full shadow-sm hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                                <FiPlay className="mr-2" />
                                Watch Demo
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-slate-400"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-400">
                                    +2k
                                </div>
                            </div>
                            <div className="text-sm font-medium">
                                <span className="text-white font-bold">2,000+</span> Astronauts Joined
                            </div>
                        </motion.div>
                    </div>

                    {/* Image/Graphic Content */}
                    <div className="relative mt-12 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            {/* Abstract Launch Pad Graphic */}
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-[2rem] transform rotate-3"></div>
                                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                    <div className="text-center p-8">
                                        <div className="w-32 h-32 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                            <IoMdRocket size={64} className="text-indigo-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Platform Ready</h3>
                                        <p className="text-slate-500 mb-6">T-minus 10 seconds to liftoff.</p>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-3/4 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl z-20 hidden sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    🚀
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Mission Active</p>
                                    <p className="text-xs text-slate-500">System check passed</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
