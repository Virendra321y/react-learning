import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMessageSquare, FiCalendar, FiUserPlus, FiUserCheck, FiX } from 'react-icons/fi';

const UserProfileHeader = ({ user, isFollowing, onFollowToggle, isOwnProfile, canChat, onMessageClick, isChatVisible }) => {
    const [loading, setLoading] = React.useState(false);

    const handleFollowClick = async () => {
        setLoading(true);
        await onFollowToggle(user.id, !isFollowing);
        setLoading(false);
    };

    return (
        <div className="relative mb-8">
            {/* Cover Image Placeholder */}
            <div className="h-48 md:h-64 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full object-cover shadow-sm">
                <div className="w-full h-full bg-black/10 rounded-xl backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="-mt-16 sm:-mt-20 md:-mt-24 relative flex flex-col md:flex-row items-end md:items-end gap-6 pb-4">

                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white
              ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400'}`}
                        />
                    </motion.div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0 pb-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 truncate">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium truncate">@{user.username}</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <FiMapPin /> Planet Earth
                            </span>
                            <span className="flex items-center gap-1">
                                <FiCalendar /> Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pb-4 flex gap-3">
                        {!isOwnProfile && canChat && (
                            <button
                                onClick={onMessageClick}
                                className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2
                                    ${isChatVisible
                                        ? 'bg-slate-800 text-white hover:bg-slate-900'
                                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                {isChatVisible ? <FiX size={20} /> : <FiMessageSquare size={20} />}
                                {isChatVisible ? 'Close Chat' : 'Message'}
                            </button>
                        )}

                        {!isOwnProfile && (
                            <button
                                onClick={handleFollowClick}
                                disabled={loading}
                                className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2
                    ${isFollowing
                                        ? 'bg-white text-slate-700 hover:bg-red-50 hover:text-red-500 border border-slate-200'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                                    }`}
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isFollowing ? (
                                    <><FiUserCheck size={20} /> Following</>
                                ) : (
                                    <><FiUserPlus size={20} /> Follow</>
                                )}
                            </button>
                        )}

                        {isOwnProfile && (
                            <button className="px-6 py-2.5 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileHeader;
