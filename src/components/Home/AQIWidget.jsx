import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiWind, FiAlertCircle, FiInfo, FiMapPin } from 'react-icons/fi';

const AQIWidget = () => {
    const [aqiData, setAqiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState('New Delhi, India');

    useEffect(() => {
        const fetchAQI = async (lat, lon) => {
            try {
                setLoading(true);
                let url;
                if (lat && lon) {
                    url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=demo`;
                } else {
                    // Default to New Delhi if geo is unavailable
                    url = `https://api.waqi.info/feed/delhi/?token=demo`;
                }

                const response = await axios.get(url);

                if (response.data.status === 'ok') {
                    const data = response.data.data;
                    setAqiData(data);
                    setLocation(data.city.name.split(',')[0]); // Take the first part of the location name
                } else {
                    throw new Error('Geolocation failed');
                }
                setLoading(false);
            } catch (err) {
                console.error('AQI Fetch Error:', err);
                setError('Location unavailable');
                setLoading(false);
            }
        };

        const getLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchAQI(latitude, longitude);
                    },
                    (err) => {
                        console.warn("Geolocation denied, using default: New Delhi", err);
                        fetchAQI(); // Fallback to Delhi
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                fetchAQI();
            }
        };

        getLocation();
    }, []);

    const getAQIInfo = (aqi) => {
        if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Air is fresh and safe.' };
        if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', desc: 'Acceptable for most.' };
        if (aqi <= 150) return { label: 'Unhealthy*', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', desc: 'Sensitive groups avoid outdoors.' };
        if (aqi <= 200) return { label: 'Harmful', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', desc: 'Avoid prolonged exertion.' };
        return { label: 'Critical', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', desc: 'Stay indoors, use filters.' };
    };

    if (loading) return (
        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-pulse h-48 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <FiWind className="w-8 h-8 text-blue-400 animate-bounce" />
                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Checking Air Quality...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-6 bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 text-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <FiAlertCircle className="w-6 h-6 text-red-400" />
                <span className="font-bold text-sm">Location unavailable</span>
            </div>
            <p className="text-xs text-white/40">Showing default Indian AQI data.</p>
        </div>
    );

    const info = getAQIInfo(aqiData.aqi);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 ${info.bg} backdrop-blur-xl rounded-2xl border ${info.border} shadow-xl relative overflow-hidden group`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 text-white/40 mb-1">
                        <FiMapPin className="text-xs" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live AQI Tracker</span>
                    </div>
                    <h3 className="text-white text-base font-black truncate leading-tight" title={location}>
                        {location}
                    </h3>
                </div>
                <div className={`px-2.5 py-1 rounded-lg ${info.bg} border ${info.border} ${info.color} text-[10px] font-black uppercase tracking-wider`}>
                    {info.label}
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                        <motion.circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor" strokeWidth="6" fill="transparent"
                            strokeDasharray={213.6}
                            initial={{ strokeDashoffset: 213.6 }}
                            animate={{ strokeDashoffset: 213.6 - (Math.min(aqiData.aqi, 300) / 300) * 213.6 }}
                            className={`${info.color} transition-all duration-1000`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{aqiData.aqi}</span>
                        <span className="text-[8px] text-white/40 font-black uppercase">AQI</span>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-black">
                        <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-white/60">
                            TEMP: <span className="text-white">{aqiData.iaqi.t?.v || '--'}°C</span>
                        </div>
                        <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-white/60">
                            HUMID: <span className="text-white">{aqiData.iaqi.h?.v || '--'}%</span>
                        </div>
                        <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-white/60">
                            PM2.5: <span className="text-white">{aqiData.iaqi.pm25?.v || 'N/A'}</span>
                        </div>
                        <div className="bg-white/5 px-2 py-1 rounded border border-white/5 text-white/60">
                            PM10: <span className="text-white">{aqiData.iaqi.pm10?.v || 'N/A'}</span>
                        </div>
                    </div>
                    <p className="text-xs text-white/80 font-medium leading-relaxed">
                        {info.desc}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${info.color} animate-pulse`} />
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Station: {aqiData.attributions?.[0]?.name.split(' ')[0] || 'Local'}</span>
                </div>
                <FiInfo className="text-white/20 hover:text-white transition-colors cursor-pointer" />
            </div>
        </motion.div>
    );
};

export default AQIWidget;
