import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiStar, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
import policeBanner from '../../assets/indian_police_soldiers_banner.png';
import upPoliceLogo from '../../assets/up_police_logo_emblem.png';

const PromotionStep = ({ onNext }) => {
    return (
        <div className="w-full font-sans">
            {/* ... header and banner ... */}
            {/* Official Header Section */}
            <div className="bg-red-700 text-white py-3 px-6 shadow-md relative z-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-4">
                        <img
                            src={upPoliceLogo}
                            alt="UP Police Emblem"
                            className="h-16 w-16 md:h-20 md:w-20 drop-shadow-md bg-white rounded-full p-1"
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">Uttar Pradesh Police Recruitment & Promotion Board</h2>
                            <h3 className="text-sm md:text-lg font-medium text-red-100">उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड</h3>
                        </div>
                    </div>
                    <div className="hidden md:block text-right text-sm opacity-90 font-medium">
                        <p>Government of Uttar Pradesh</p>
                        <p>Lucknow, India</p>
                    </div>
                </div>
            </div>

            {/* Hero Image Section */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <img
                    src={policeBanner}
                    alt="Indian Police Personnel"
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4"
                    >
                        Police Jobs 2026
                    </motion.h1>
                    <p className="text-yellow-400 font-bold text-xl md:text-2xl tracking-widest uppercase drop-shadow-md">Latest Indian Police Notifications</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="min-h-[60vh] p-8 md:p-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-red-400 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Animated Date Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-wrap gap-4 justify-center"
                    >
                        {/* Start Date */}
                        <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-l-4 border-green-500 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                <FiCalendar className="text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Start Date</p>
                                <p className="text-lg font-bold text-slate-800">01 Jan 2026</p>
                            </div>
                        </div>

                        {/* End Date - High Urgency Animation */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="bg-white px-6 py-3 rounded-xl shadow-xl border-l-4 border-red-600 flex items-center gap-3 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                <FiClock className="text-xl animate-spin-slow" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Last Date to Apply</p>
                                <p className="text-xl font-extrabold text-red-700">20 Jan 2026</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Important Notice Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-l-4 border-red-600 shadow-md p-6 mb-8 rounded-r-lg"
                    >
                        <h4 className="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
                            <span className="animate-pulse">🔴</span> New Recruitment Details
                        </h4>
                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base">
                            <p className="font-semibold mb-2">
                                Police Jobs 2026–27: Aspirants looking for Latest Police Jobs 2026 in India can get the Police recruitment 2026 notifications on this page.
                                Indian Police Officer Job vacancies on 06.01.2026 will be listed out here for both female and male candidates.
                            </p>
                            <p className="mb-2">
                                Freshers and experienced candidates will be able to find numerous job opportunities across India through JobsCloud.
                                Job Seekers get free recruitment Alert by subscribing JobsCloud. We will provide you with the complete recruitment information for all police jobs 2026 on a single page.
                            </p>
                            <p>
                                Police Jobs Vacancy, Exam dates, Eligibility and other details are also available in this page.
                                Also find Central Police and State Police Jobs for 10th Pass, 12th, Graduates & Post Graduates.
                            </p>

                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-green-800 font-bold text-center animate-bounce-slow">
                                ✨ NOTICE: 9th appear people can apply also this form ✨
                            </div>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: <FiShield />, title: "Secure Future", desc: "Government Service Protection" },
                            { icon: <FiStar />, title: "Prestigious Role", desc: "Serve with Honor & Pride" },
                            { icon: <FiCheckCircle />, title: "Easy Application", desc: "Digital & Streamlined Process" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="inline-block p-3 rounded-full bg-blue-50 text-blue-600 text-2xl mb-3">
                                    {item.icon}
                                </div>
                                <h5 className="font-bold text-slate-800">{item.title}</h5>
                                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onNext}
                            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-wide ring-4 ring-red-100"
                        >
                            Proceed to Apply
                            <FiArrowRight />
                        </motion.button>
                        <p className="mt-4 text-xs text-slate-400">
                            By clicking Proceed, you agree to the terms and eligibility criteria.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionStep;

