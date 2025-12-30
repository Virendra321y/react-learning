import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckCircle, FiTrash2, FiMessageSquare, FiUserPlus, FiInfo } from 'react-icons/fi';
import { notificationAPI } from '../../services/api';
import websocketService from '../../services/websocketService';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationAPI.getNotifications(0, 5);
            setNotifications(response.data.data.content);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationAPI.getUnreadCount();
            setUnreadCount(response.data.data);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        fetchNotifications();

        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev].slice(0, 10));
            setUnreadCount(prev => prev + 1);
        };

        websocketService.onNotification(handleNewNotification);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            websocketService.removeNotificationHandler(handleNewNotification);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await notificationAPI.delete(id);
            const wasUnread = !notifications.find(n => n.id === id)?.isRead;
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }
        if (notification.targetUrl) {
            navigate(notification.targetUrl);
        }
        setIsOpen(false);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'MESSAGE': return <FiMessageSquare className="text-blue-500" />;
            case 'FOLLOW': return <FiUserPlus className="text-green-500" />;
            case 'ADMIN': return <FiInfo className="text-purple-500" />;
            default: return <FiBell className="text-gray-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
                <FiBell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 overflow-hidden z-50"
                    >
                        <div className="px-4 py-3 border-b border-slate-50 bg-gradient-to-r from-purple-50 to-blue-50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                >
                                    <FiCheckCircle /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={clsx(
                                            "px-4 py-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors border-b border-slate-50 last:border-0",
                                            !notification.isRead && "bg-blue-50/50"
                                        )}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                                {getIcon(notification.type)}
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className={clsx(
                                                "text-xs leading-relaxed",
                                                !notification.isRead ? "text-slate-900 font-semibold" : "text-slate-600"
                                            )}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={(e) => handleDelete(e, notification.id)}
                                                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center">
                                    <FiBell size={24} className="mx-auto text-slate-200 mb-2" />
                                    <p className="text-sm text-slate-400">No notifications yet</p>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-2 border-t border-slate-50 text-center">
                            <button className="text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors">
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationsDropdown;
