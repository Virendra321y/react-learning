import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiStar, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
import policeBanner from '../../assets/up_police_inclusive_background.png';
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
            <div className="relative h-[60vh] md:h-[80vh] min-h-[500px] overflow-hidden group">
                {/* Background Image */}
                <img
                    src={policeBanner}
                    alt="UP Police Training and Parade Background"
                    className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>

                {/* Central Emblem Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 transform translate-y-[-10%] md:translate-y-[-5%]">
                    <motion.img
                        src={upPoliceLogo}
                        alt="Uttar Pradesh Police Emblem"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20"
                    />
                </div>

                {/* Text Content */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-8 md:p-12 text-center pb-16 md:pb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 tracking-tight"
                    >
                        UP Police Jobs 2026
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-yellow-400 font-bold text-lg md:text-2xl tracking-[0.2em] uppercase drop-shadow-lg"
                    >
                        Protect • Serve • Honor
                    </motion.p>
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

                        {/* Total Openings - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-4 rounded-xl shadow-2xl border-2 border-blue-300 flex items-center gap-4 relative overflow-hidden ring-4 ring-blue-200"
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white relative z-10">
                                <FiStar className="text-2xl" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">Total Openings</p>
                                <p className="text-xs text-blue-100 font-hindi">कुल रिक्तियां</p>
                                <p className="text-3xl font-black text-white drop-shadow-lg">50,000</p>
                            </div>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"></div>
                        </motion.div>
                    </motion.div>

                    {/* Important Notice Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-l-4 border-red-600 shadow-md p-6 mb-8 rounded-r-lg"
                    >
                        <h4 className="text-xl md:text-2xl font-bold text-red-700 mb-4 flex flex-col md:flex-row md:items-center gap-2">
                            <span className="flex items-center gap-2"><span className="animate-pulse">🔴</span> New Recruitment Details</span>
                            <span className="text-sm md:text-lg font-medium text-slate-500 hidden md:inline">|</span>
                            <span className="text-lg md:text-xl text-red-600 font-hindi">नई भर्ती विवरण</span>
                        </h4>

                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base space-y-4">
                            <div>
                                <h5 className="font-bold text-slate-900 border-b pb-1 mb-2">Instructions (निर्देश):</h5>
                                <p className="font-semibold text-slate-800">
                                    UP Police Jobs 2026–27: Aspirants looking for Latest Police Jobs 2026 in Uttar Pradesh can get the Police recruitment 2026 notifications on this page.
                                    Uttar Pradesh Police Officer Job vacancies on 06.01.2026 will be listed out here for both female and male candidates.
                                </p>
                                <p className="text-slate-600 italic font-hindi mt-1">
                                    यूपी पुलिस नौकरियां 2026-27: उत्तर प्रदेश में नवीनतम पुलिस नौकरियों की तलाश कर रहे उम्मीदवार इस पृष्ठ पर पुलिस भर्ती 2026 की अधिसूचनाएं प्राप्त कर सकते हैं।
                                    06.01.2026 की उत्तर प्रदेश पुलिस अधिकारी की रिक्तियां यहां महिला और पुरुष दोनों उम्मीदवारों के लिए सूचीबद्ध की जाएंगी।
                                </p>
                            </div>

                            <div>
                                <p>
                                    Freshers and experienced candidates will be able to find numerous job opportunities across Uttar Pradesh through JobsCloud.
                                    Job Seekers get free recruitment Alert by subscribing JobsCloud. We will provide you with the complete recruitment information for all UP police jobs 2026 on a single page.
                                </p>
                                <p className="text-slate-600 italic font-hindi mt-1">
                                    फ्रेशर्स और अनुभवी उम्मीदवार जॉब्सक्लाउड के माध्यम से पूरे उत्तर प्रदेश में नौकरी के कई अवसर प्राप्त कर सकेंगे।
                                    नौकरी चाहने वालों को जॉब्सक्लाउड की सदस्यता लेकर मुफ्त भर्ती चेतावनी मिलती है। हम आपको सभी यूपी पुलिस नौकरियों 2026 के लिए पूरी भर्ती जानकारी एक ही पृष्ठ पर प्रदान करेंगे।
                                </p>
                            </div>

                            <div>
                                <p>
                                    UP Police Jobs Vacancy, Exam dates, Eligibility and other details are also available in this page.
                                    Also find Central Police and State Police Jobs for 10th Pass, 12th, Graduates & Post Graduates.
                                </p>
                            </div>

                            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800 font-bold text-center animate-bounce-slow shadow-sm">
                                <p>✨ NOTICE: 9th appear people can apply also this form ✨</p>
                                <p className="text-sm font-hindi mt-1">✨ सूचना: 9वीं कक्षा के छात्र भी इस फॉर्म के लिए आवेदन कर सकते हैं ✨</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Wise Requirements Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                            Category Wise Requirements <br />
                            <span className="text-xl text-indigo-600 font-hindi">श्रेणी वार आवश्यकताएं</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* General Category */}
                            <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-500 overflow-hidden hover:shadow-lg transition-all">
                                <div className="bg-blue-50 p-4 border-b border-blue-100">
                                    <h4 className="font-bold text-lg text-blue-800">General (UR)</h4>
                                    <p className="text-sm text-blue-600 font-hindi">सामान्य श्रेणी</p>
                                </div>
                                <div className="p-5">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
                                            <span>Aadhaar Card <span className="block text-xs text-slate-500 font-hindi">(आधार कार्ड)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
                                            <span>10th/12th Marksheet <span className="block text-xs text-slate-500 font-hindi">(10वीं/12वीं की अंकसूची)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
                                            <span>Passport Photo <span className="block text-xs text-slate-500 font-hindi">(पासपोर्ट फोटो)</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* OBC Category */}
                            <div className="bg-white rounded-xl shadow-md border-t-4 border-orange-500 overflow-hidden hover:shadow-lg transition-all">
                                <div className="bg-orange-50 p-4 border-b border-orange-100">
                                    <h4 className="font-bold text-lg text-orange-800">OBC</h4>
                                    <p className="text-sm text-orange-600 font-hindi">अन्य पिछड़ा वर्ग</p>
                                </div>
                                <div className="p-5">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
                                            <span>All General Docs <span className="block text-xs text-slate-500 font-hindi">(सभी सामान्य दस्तावेज)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiStar className="text-orange-500 mt-1 shrink-0" />
                                            <span className="font-medium">OBC Certificate <span className="block text-xs text-slate-500 font-hindi">(ओबीसी प्रमाण पत्र)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiStar className="text-orange-500 mt-1 shrink-0" />
                                            <span className="font-medium">Domicile Certificate <span className="block text-xs text-slate-500 font-hindi">(मूल निवास प्रमाण पत्र)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiStar className="text-orange-500 mt-1 shrink-0" />
                                            <span className="font-medium">Income Certificate <span className="block text-xs text-slate-500 font-hindi">(आय प्रमाण पत्र)</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* SC/ST Category */}
                            <div className="bg-white rounded-xl shadow-md border-t-4 border-purple-500 overflow-hidden hover:shadow-lg transition-all">
                                <div className="bg-purple-50 p-4 border-b border-purple-100">
                                    <h4 className="font-bold text-lg text-purple-800">SC / ST</h4>
                                    <p className="text-sm text-purple-600 font-hindi">अनुसूचित जाति / जनजाति</p>
                                </div>
                                <div className="p-5">
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiCheckCircle className="text-green-500 mt-1 shrink-0" />
                                            <span>All General Docs <span className="block text-xs text-slate-500 font-hindi">(सभी सामान्य दस्तावेज)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiStar className="text-purple-500 mt-1 shrink-0" />
                                            <span className="font-medium">Caste Certificate <span className="block text-xs text-slate-500 font-hindi">(जाति प्रमाण पत्र)</span></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <FiStar className="text-purple-500 mt-1 shrink-0" />
                                            <span className="font-medium">Domicile Certificate <span className="block text-xs text-slate-500 font-hindi">(मूल निवास प्रमाण पत्र)</span></span>
                                        </li>
                                    </ul>
                                </div>
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

