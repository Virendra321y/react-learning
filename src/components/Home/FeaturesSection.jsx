import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiLayers, FiZap, FiUsers, FiTrendingUp, FiShield } from 'react-icons/fi';

const features = [
    {
        icon: <FiCode />,
        title: 'Interactive Coding',
        description: 'Write code directly in the browser with our advanced integrated development environment.'
    },
    {
        icon: <FiLayers />,
        title: 'Comprehensive Curriculum',
        description: "From basics to advanced patterns, our structured learning path covers it all."
    },
    {
        icon: <FiUsers />,
        title: 'Community Code Reviews',
        description: 'Get feedback on your code from experienced developers and peers.'
    },
    {
        icon: <FiZap />,
        title: 'Real-time Updates',
        description: 'See your changes instantly with our hot module replacement technology.'
    },
    {
        icon: <FiTrendingUp />,
        title: 'Progress Tracking',
        description: 'Monitor your growth with detailed statistics and skill assessments.'
    },
    {
        icon: <FiShield />,
        title: 'Certification',
        description: 'Earn recognized certificates upon completion of major course milestones.'
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Why Choose Us</h2>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Everything you need to master React
                    </p>
                    <p className="mt-4 text-xl text-slate-500">
                        Our platform provides the tools, resources, and community support to take your skills to the next level.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 group"
                        >
                            <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
