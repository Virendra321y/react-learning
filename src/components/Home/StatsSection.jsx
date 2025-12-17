import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Active Students', value: '15,000+' },
    { label: 'Course Modules', value: '120+' },
    { label: 'Community Posts', value: '50k+' },
    { label: 'Code Submissions', value: '1M+' },
];

const StatsSection = () => {
    return (
        <section className="py-20 bg-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <motion.span
                                initial={{ scale: 0.5, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-4xl md:text-5xl font-extrabold text-white mb-2"
                            >
                                {stat.value}
                            </motion.span>
                            <span className="text-blue-100 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
