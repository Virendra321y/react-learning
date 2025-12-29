import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiSunrise, FiSunset, FiWind, FiChevronDown, FiBell } from 'react-icons/fi';

const DateTimeHeader = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [aqiData, setAqiData] = useState(null);
    const [locationName, setLocationName] = useState('Bangalore');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch AQI Data
    useEffect(() => {
        const fetchAQI = async (lat, lon, name = 'Bangalore') => {
            try {
                const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi&timezone=auto`;
                const response = await axios.get(url);
                if (response.data && response.data.current) {
                    setAqiData(response.data.current.european_aqi);
                    setLocationName(name);
                }
            } catch (err) {
                console.error('AQI Fetch Error:', err);
            }
        };

        const initLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                            const city = geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.state_district || 'Local';
                            fetchAQI(latitude, longitude, city);
                        } catch (e) {
                            fetchAQI(latitude, longitude, 'Local');
                        }
                    },
                    () => fetchAQI(12.9716, 77.5946, 'Bangalore'),
                    { timeout: 5000 }
                );
            } else {
                fetchAQI(12.9716, 77.5946, 'Bangalore');
            }
        };

        initLocation();
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 5) return { text: "Good Night", icon: FiMoon, color: "text-indigo-300" };
        if (hour < 12) return { text: "Good Morning", icon: FiSunrise, color: "text-amber-300" };
        if (hour < 17) return { text: "Good Afternoon", icon: FiSun, color: "text-orange-300" };
        if (hour < 21) return { text: "Good Evening", icon: FiSunset, color: "text-purple-300" };
        return { text: "Good Night", icon: FiMoon, color: "text-indigo-300" };
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }).split(' ');
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const greeting = getGreeting();
    const [time, period] = formatTime(currentTime);

    return (
        <div className="w-full flex justify-between items-start mb-10 relative z-50">
            {/* Left: Compact Time Capsule */}
            <div className="relative h-[88px] w-[220px]"> {/* Reserved space for layout stability */}
                <motion.div
                    layout
                    className="absolute top-0 left-0 z-50 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden group cursor-pointer"
                    style={{ minWidth: '220px' }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Shiny Reflection Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent opacity-50 pointer-events-none" />

                    {/* Main Content (Always Visible) */}
                    <div className="p-4 flex items-center gap-4 relative z-10">
                        <div className={`p-2.5 rounded-full bg-black/20 text-white ${greeting.color} shadow-inner`}>
                            <greeting.icon size={20} />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white tracking-tight">{time}</span>
                                <span className="text-xs font-bold text-white/60">{period}</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1">
                                {greeting.text}
                                <FiChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </p>
                        </div>
                    </div>

                    {/* Expanded Content (Details) */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-5 pb-5 pt-0 relative z-10 border-t border-white/5"
                            >
                                <div className="pt-3 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-white/80">
                                        <span className="font-medium">{formatDate(currentTime)}</span>
                                    </div>

                                    {aqiData && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="p-1.5 bg-emerald-500/20 rounded text-emerald-400">
                                                <FiWind />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-white">{aqiData} AQI</span>
                                                <span className="text-[10px] text-white/40 uppercase tracking-wider">{locationName}</span>
                                            </div>
                                        </div>
                                    )}

                                    <button className="w-full py-1.5 mt-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-colors">
                                        View Full Report
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Glow under the capsule */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-xl opacity-20 -z-10" />
            </div>

            {/* Right: Actions (Bell Only) */}
            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95">
                    <FiBell />
                </button>
            </div>
        </div>
    );
};

export default DateTimeHeader;
