import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [location, setLocation] = useState({ name: 'Loading...', lat: 28.6139, lon: 77.2090 });

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                );
                setWeather(response.data.current_weather);
                setLoading(false);
            } catch (err) {
                setError('Failed to load weather');
                setLoading(false);
            }
        };

        const getLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ name: 'Your Location', lat: latitude, lon: longitude });
                        fetchWeather(latitude, longitude);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        setLocation({ name: 'New Delhi, IN', lat: 28.6139, lon: 77.2090 });
                        fetchWeather(28.6139, 77.2090);
                    }
                );
            } else {
                setLocation({ name: 'New Delhi, IN', lat: 28.6139, lon: 77.2090 });
                fetchWeather(28.6139, 77.2090);
            }
        };

        getLocation();
    }, []);

    const getWeatherInfo = (code) => {
        if (code === 0) return { icon: <WiDaySunny className="text-yellow-400 w-12 h-12" />, label: 'Clear Sky' };
        if (code <= 3) return { icon: <WiCloudy className="text-gray-400 w-12 h-12" />, label: 'Partly Cloudy' };
        if (code <= 69) return { icon: <WiRain className="text-blue-400 w-12 h-12" />, label: 'Rainy' };
        if (code <= 79) return { icon: <WiSnow className="text-white w-12 h-12" />, label: 'Snowy' };
        return { icon: <WiThunderstorm className="text-purple-400 w-12 h-12" />, label: 'Stormy' };
    };

    if (loading) return (
        <div className="p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 animate-pulse h-40 flex items-center justify-center text-white font-medium">
            Loading Weather...
        </div>
    );

    if (error) return (
        <div className="p-6 bg-red-500/20 backdrop-blur-md rounded-2xl border border-red-500/30 text-white font-medium">
            {error}
        </div>
    );

    const info = getWeatherInfo(weather.weathercode);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-white/70 text-sm font-medium uppercase tracking-wider">Current Weather</h3>
                    <p className="text-white text-lg font-bold">{location.name}</p>
                </div>
                {info.icon}
            </div>

            <div className="flex items-end gap-2 text-white">
                <span className="text-4xl font-black">{Math.round(weather.temperature)}°</span>
                <span className="text-xl font-medium mb-1">C</span>
            </div>

            <div className="mt-4 flex gap-4 text-white/60 text-sm">
                <div className="flex flex-col">
                    <span>Wind</span>
                    <span className="text-white font-bold">{weather.windspeed} km/h</span>
                </div>
                <div className="flex flex-col">
                    <span>Status</span>
                    <span className="text-white font-bold">{info.label}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherWidget;
