import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUser, FiUserPlus, FiUserCheck } from 'react-icons/fi';

const UserCard = ({ user, isFollowing, onFollowToggle }) => {
    const [loading, setLoading] = React.useState(false);

    const handleFollowClick = async (e) => {
        e.preventDefault(); // Prevent navigation if inside a link
        setLoading(true);
        await onFollowToggle(user.id, !isFollowing);
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 border border-slate-100 flex items-center justify-between"
        >
            <Link to={`/users/${user.id}`} className="flex items-center gap-4 group flex-1 mr-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-transparent group-hover:border-purple-200 transition-all">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                            <FiUser size={24} />
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">@{user.username}</p>
                </div>
            </Link>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleFollowClick}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${isFollowing
                            ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
                        }
              ${loading ? 'opacity-70 cursor-wait' : ''}
            `}
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isFollowing ? (
                        <>
                            <FiUserCheck className="text-lg" />
                            <span className="hidden sm:inline">Following</span>
                        </>
                    ) : (
                        <>
                            <FiUserPlus className="text-lg" />
                            <span className="hidden sm:inline">Follow</span>
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};


export default UserCard;
