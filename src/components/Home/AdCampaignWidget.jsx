import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiExternalLink } from 'react-icons/fi';

const AD_CONTENT = [
    {
        id: 1,
        title: "Lifetime Free Credit Card",
        desc: "Apply now and get ₹5000 Amazon Voucher*. limited period offer.",
        url: "https://www.google.com/search?q=credit+card+offers",
        img: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=200",
        cta: "Apply Now",
        color: "text-blue-600"
    },
    {
        id: 2,
        title: "Best Personal Loan Rates",
        desc: "Instant approval up to ₹10 Lakhs. Interest starting @ 10.99%.",
        url: "https://www.google.com/search?q=personal+loan",
        img: "https://images.unsplash.com/photo-1579621970563-ebec7560b813?auto=format&fit=crop&q=80&w=200",
        cta: "Check Eligibility",
        color: "text-green-600"
    },
    {
        id: 3,
        title: "Start Your Online Store",
        desc: "Domain + Hosting @ ₹199/mo. 24/7 Support.",
        url: "https://www.google.com/search?q=web+hosting",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200",
        cta: "Start Today",
        color: "text-purple-600"
    }
];

const AdCampaignWidget = ({ className = "" }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % AD_CONTENT.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const ad = AD_CONTENT[currentAdIndex];

    return (
        <div className={`relative overflow-hidden bg-white rounded flex flex-col items-center justify-center border border-gray-200 shadow-sm ${className}`} style={{ minHeight: '250px' }}>
            {/* Google Ads Mimic Header */}
            <div className="absolute top-0 right-0 left-0 flex justify-end px-1 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 cursor-pointer hover:bg-gray-100 px-1">
                    <FiInfo size={10} />
                    <span>Ads by Google</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.a
                    key={ad.id}
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center p-4 w-full h-full text-center group cursor-pointer"
                >
                    <div className="flex-1 flex items-center justify-center w-full mb-3 overflow-hidden">
                        <img
                            src={ad.img}
                            alt={ad.title}
                            className="w-full h-32 object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <h4 className={`text-lg font-bold ${ad.color} underline-offset-2 group-hover:underline mb-1 line-clamp-1`}>
                        {ad.title}
                    </h4>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {ad.desc}
                    </p>

                    <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full text-sm shadow hover:bg-blue-700 transition-colors flex items-center gap-2">
                        {ad.cta} <FiExternalLink />
                    </button>
                </motion.a>
            </AnimatePresence>

            <div className="absolute bottom-1 right-1 bg-gray-100 text-[9px] px-1 text-gray-400 rounded">
                Sponsored
            </div>
        </div>
    );
};

export default AdCampaignWidget;
