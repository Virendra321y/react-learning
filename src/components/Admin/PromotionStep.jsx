import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiStar, FiCheckCircle } from 'react-icons/fi';

const PromotionStep = ({ onNext }) => {
    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Colorful Banner */}
            <div className="h-48 bg-gradient-to-r from-orange-500 via-white to-green-500 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                <div className="relative z-10 text-center">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-2xl p-2 flex items-center justify-center mb-[-64px] border-4 border-white transform hover:scale-105 transition-transform">
                        {/* Assuming the generated logo is accessible via a public URL or similar. 
                            For now, let's use the local path if possible or a placeholder style.
                            In a real app, this would be an <img> tag.
                        */}
                        <img
                            src="/src/assets/logo.png"
                            alt="Indian Police Recruitment"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=Police+Logo';
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-12 px-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-extrabold text-slate-900 mb-4"
                >
                    Indian Police Recruitment 2026
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-500 max-w-2xl mx-auto mb-10"
                >
                    A prestigious career awaits you. Join the force and serve the nation with pride, honor, and courage. Be the change you want to see.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: <FiShield />, title: "Service & Integrity", desc: "Commitment to public safety" },
                        { icon: <FiStar />, title: "Great Benefits", desc: "Stable career & pension" },
                        { icon: <FiCheckCircle />, title: "Quick Process", desc: "Streamlined digital application" }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                            <div className="text-2xl text-orange-600 mb-3 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
                            <p className="text-sm text-slate-500">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNext}
                    className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-orange-600 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all gap-2 group"
                >
                    Apply Now
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </div>
    );
};

export default PromotionStep;
