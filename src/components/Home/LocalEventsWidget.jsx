import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock } from 'react-icons/fi';

const EVENTS = [
    {
        id: 1,
        title: "Techno Bunker Night",
        location: "Koramangala Socials",
        time: "Tonight, 9:00 PM",
        price: "₹1500 Onwards",
        type: "PARTY",
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 2,
        title: "React Bangalore Meetup",
        location: "WeWork Galaxy",
        time: "Sat, 10:00 AM",
        price: "Free",
        type: "TECH",
        image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 3,
        title: "Standup: Zakir Khan Live",
        location: "Good Shepherd Auditorium",
        time: "Sunday, 7:00 PM",
        price: "₹999",
        type: "COMEDY",
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=400"
    }
];

const LocalEventsWidget = () => {
    return (
        <div className="p-0 bg-slate-900 rounded-2xl overflow-hidden border border-white/10 relative">
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <FiMapPin className="text-pink-500" />
                        Happening Nearby
                    </h3>
                </div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">Curated Events for You</p>
            </div>

            <div className="flex flex-col divide-y divide-white/5">
                {EVENTS.map((event, idx) => (
                    <motion.div
                        key={event.id}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="p-4 flex gap-4 cursor-pointer transition-colors group"
                    >
                        <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden relative flex-shrink-0">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate mb-1 group-hover:text-pink-400 transition-colors">{event.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-white/50 font-medium mb-2">
                                <span className="flex items-center gap-1"><FiMapPin size={10} /> {event.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                                    <FiClock size={10} /> {event.time}
                                </span>
                                <span className="text-white font-black text-xs">{event.price}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                <button className="text-[10px] text-pink-500 font-bold uppercase tracking-widest hover:text-pink-400 transition-colors">
                    Explore All Events
                </button>
            </div>
        </div>
    );
};

export default LocalEventsWidget;
