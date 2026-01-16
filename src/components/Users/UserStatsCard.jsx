import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiMessageSquare, FiUsers, FiUserCheck, FiHeart } from 'react-icons/fi';

const StatItem = ({ icon: Icon, label, value, color }) => (
    <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all duration-300">
        <div className={`w-10 h-10 rounded-full ${color} bg-opacity-10 flex items-center justify-center mb-2`}>
            <Icon className={`text-xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
    </div>
);

const UserStatsCard = ({ stats }) => {
    if (!stats) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-1 h-6 bg-purple-500 rounded-full mr-3"></span>
                Community Stats
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatItem
                    icon={FiFileText}
                    label="Posts"
                    value={stats.totalPosts}
                    color="bg-blue-500"
                />
                <StatItem
                    icon={FiMessageSquare}
                    label="Comments"
                    value={stats.totalComments}
                    color="bg-green-500"
                />
                <StatItem
                    icon={FiUsers}
                    label="Followers"
                    value={stats.followersCount || 0}
                    color="bg-purple-500"
                />
                <StatItem
                    icon={FiUserCheck}
                    label="Following"
                    value={stats.followingCount || 0}
                    color="bg-orange-500"
                />
                <StatItem
                    icon={FiHeart}
                    label="Total Likes"
                    value={stats.totalLikes || 0}
                    color="bg-pink-500"
                />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400">
                <span>Member since {new Date().getFullYear() - (stats.accountAge / 365).toFixed(0)} years</span>
                {stats.lastLoginAt && (
                    <span>Last active: {new Date(stats.lastLoginAt).toLocaleDateString()}</span>
                )}
            </div>
        </motion.div>
    );
};

export default UserStatsCard;
