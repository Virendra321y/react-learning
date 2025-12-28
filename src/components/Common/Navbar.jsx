import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiChevronDown, FiUserCheck } from 'react-icons/fi';
import { IoMdRocket } from 'react-icons/io'; // Rocket icon
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const profileRef = useRef(null);

    const { user, logout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
        setIsProfileOpen(false);
    }, [location]);

    // Close profile dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Posts', path: '/posts' },
        { name: 'Categories', path: '/categories' },
    ];

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };


    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
                scrolled
                    ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 border-white/20 shadow-xl py-3'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-white/10 shadow-lg py-4'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Left Side: Logo + Nav Links */}
                    <div className="flex items-center gap-8">
                        {/* Logo Section */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:bg-white/30 relative overflow-visible">
                                    <style>{`
                                        @keyframes swim-circle {
                                            0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
                                            100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
                                        }
                                        @keyframes swim-circle-small {
                                            0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
                                            100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
                                        }
                                        @keyframes colorful-blink {
                                            0%, 100% { 
                                                background: linear-gradient(90deg, #fff, #ffd700);
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                opacity: 1;
                                            }
                                            25% { 
                                                background: linear-gradient(90deg, #ff6b9d, #c084fc);
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                opacity: 0.9;
                                            }
                                            50% { 
                                                background: linear-gradient(90deg, #60a5fa, #34d399);
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                opacity: 1;
                                            }
                                            75% { 
                                                background: linear-gradient(90deg, #fbbf24, #f97316);
                                                -webkit-background-clip: text;
                                                background-clip: text;
                                                opacity: 0.9;
                                            }
                                        }
                                        .dolphin-swim { animation: swim-circle 3s linear infinite; }
                                        .fish-swim { animation: swim-circle 3s linear infinite 1.5s; }
                                        .small-fish-1 { animation: swim-circle-small 2.5s linear infinite 0.5s; }
                                        .small-fish-2 { animation: swim-circle-small 2.5s linear infinite 2s; }
                                        .text-blink { 
                                            animation: colorful-blink 3s ease-in-out infinite;
                                            -webkit-text-fill-color: transparent;
                                        }
                                    `}</style>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {/* Dolphin swimming in circle */}
                                        <span className="absolute text-xl dolphin-swim">🐬</span>
                                        {/* Tropical fish (light colored) */}
                                        <span className="absolute text-lg fish-swim">🐠</span>
                                        {/* Small fish 1 */}
                                        <span className="absolute text-sm small-fish-1">🐟</span>
                                        {/* Small fish 2 */}
                                        <span className="absolute text-xs small-fish-2">🐡</span>
                                    </div>
                                </div>
                                <span className="text-xl font-bold drop-shadow-lg hidden sm:block text-blink">
                                    SocialApp
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links (Left Aligned next to logo) */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={clsx(
                                        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                                        location.pathname === link.path
                                            ? 'bg-white text-purple-600 shadow-lg font-semibold'
                                            : 'text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Wrapper: Auth/Profile Only */}
                    <div className="hidden md:flex items-center ml-auto">
                        <div className="flex items-center">
                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-lg relative overflow-hidden">
                                            {/* User Avatar or Initials */}
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-xs">{getInitials(user.firstName, user.lastName)}</span>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-0.5 border-2 border-white z-10">
                                                <FiUserCheck size={8} className="text-white" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-semibold text-white leading-none drop-shadow">
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span className="text-[10px] text-white/80 leading-none mt-1">
                                                @{user.username}
                                            </span>
                                        </div>
                                        <FiChevronDown className={clsx("text-white/80 ml-1 transition-transform", isProfileOpen && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 overflow-hidden z-50"
                                            >
                                                <div className="px-5 py-3 border-b border-slate-50 bg-gradient-to-r from-purple-50 to-blue-50">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Signed in as</p>
                                                    <p className="text-sm font-bold text-slate-900 truncate">@{user.username}</p>
                                                </div>

                                                <div className="py-1">
                                                    <button className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 flex items-center transition-colors">
                                                        <FiUser className="mr-3 text-slate-400" /> My Profile
                                                    </button>
                                                    <button className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 flex items-center transition-colors">
                                                        <FiSettings className="mr-3 text-slate-400" /> Settings
                                                    </button>
                                                </div>

                                                <div className="my-1 border-t border-slate-50"></div>

                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center transition-colors"
                                                >
                                                    <FiLogOut className="mr-3" /> Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="px-5 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2.5 text-sm font-medium text-purple-600 bg-white rounded-xl hover:shadow-xl transition-all shadow-lg font-semibold"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={clsx(
                                        'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                                        location.pathname === link.path
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-800 mt-4 px-2">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center px-3 py-3 rounded-xl bg-slate-800">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md mr-3 overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    getInitials(user.firstName, user.lastName)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-slate-400">@{user.username}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center px-4 py-3 text-base font-medium text-red-400 bg-red-900/20 rounded-xl hover:bg-red-900/30 transition-colors"
                                        >
                                            <FiLogOut className="mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            to="/login"
                                            className="block w-full text-center px-4 py-3 text-slate-300 font-medium border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block w-full text-center px-4 py-3 text-white font-medium bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
