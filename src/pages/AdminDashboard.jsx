import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiUsers, FiFileText, FiMessageSquare, FiTrendingUp, FiCheckCircle,
    FiXCircle, FiSlash, FiShield, FiCalendar, FiActivity
} from 'react-icons/fi';
import { adminAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import clsx from 'clsx';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            toast.error('Failed to load statistics');
        }
    };

    const fetchUsers = async (pageNum = 0) => {
        setLoading(true);
        try {
            const response = await adminAPI.getAllUsers(pageNum, 10);
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            setPage(response.data.data.page);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await adminAPI.updateUserStatus(userId, newStatus);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            toast.success(`User status updated to ${newStatus}`);
            // Refresh stats to update distribution
            fetchStats();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const StatCard = ({ title, value, icon, color, subValue, subLabel }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-125 ${color}`}>
                {icon}
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                    {React.cloneElement(icon, { size: 24, className: color })}
                </div>
                <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider">{title}</h3>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                    {subValue && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            {subValue} <span className="text-[10px] uppercase font-bold text-slate-300">{subLabel}</span>
                        </p>
                    )}
                </div>
                <FiTrendingUp className="text-green-500" />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner">
                            <FiShield size={32} />
                        </div>
                        Admin Command Center
                    </h1>
                    <p className="mt-2 text-slate-500 text-lg">
                        Manage users, monitor traffic, and review application health.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2",
                            activeTab === 'stats' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <FiActivity /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2",
                            activeTab === 'users' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <FiUsers /> User Management
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'stats' ? (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers || 0}
                                icon={<FiUsers />}
                                color="text-blue-600"
                                subValue={stats?.uniqueVisitors24h}
                                subLabel="Unique Visitors (24h)"
                            />
                            <StatCard
                                title="Total Posts"
                                value={stats?.totalPosts || 0}
                                icon={<FiFileText />}
                                color="text-purple-600"
                            />
                            <StatCard
                                title="Total Comments"
                                value={stats?.totalComments || 0}
                                icon={<FiMessageSquare />}
                                color="text-pink-600"
                            />
                            <StatCard
                                title="App Traffic (24h)"
                                value={stats?.totalTraffic24h || 0}
                                icon={<FiTrendingUp />}
                                color="text-green-600"
                                subValue="Live"
                                subLabel="Monitor"
                            />
                        </div>

                        {/* Status Distribution */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <FiActivity className="text-indigo-500" /> System Activity
                                </h2>
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-slate-400 italic">Traffic Chart Visualization placeholder</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">User Health</h2>
                                <div className="space-y-4">
                                    {stats?.userStatusDistribution && Object.entries(stats.userStatusDistribution).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-3 h-3 rounded-full",
                                                    status === 'ACTIVE' ? "bg-green-500" :
                                                        status === 'INACTIVE' ? "bg-yellow-500" :
                                                            status === 'SUSPENDED' ? "bg-red-500" : "bg-slate-300"
                                                )} />
                                                <span className="capitalize font-medium text-slate-600">{status.toLowerCase()}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Joined</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 overflow-hidden">
                                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                                        <p className="text-xs text-slate-500">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
                                                    user.role === 'ADMIN' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1">
                                                <FiCalendar size={14} className="text-slate-300" />
                                                {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                                    user.status === 'ACTIVE' ? "bg-green-100 text-green-700" :
                                                        user.status === 'SUSPENDED' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                                )}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {user.status !== 'ACTIVE' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(user.id, 'ACTIVE')}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                            title="Activate"
                                                        >
                                                            <FiCheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    {user.status !== 'SUSPENDED' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(user.id, 'SUSPENDED')}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Suspend"
                                                        >
                                                            <FiSlash size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">Page {page + 1} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => fetchUsers(page - 1)}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={page === totalPages - 1}
                                        onClick={() => fetchUsers(page + 1)}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
