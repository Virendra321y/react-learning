import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import useChatStore from '../../hooks/useChatStore';

const MessagesDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const {
        conversations,
        fetchConversations,
        unreadCount,
        fetchUnreadCount,
        markAsRead,
        setActiveConversation,
        openChat
    } = useChatStore();

    // Fetch data on mount and interval
    useEffect(() => {
        fetchConversations();
        fetchUnreadCount();

        // Optional: periodic polling if websocket misses something, 
        // though websocket should handle real-time updates primarily.
        const intervalId = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // Check every 30s

        return () => clearInterval(intervalId);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleConversationClick = (conversation) => {
        setIsOpen(false);
        // Explicitly update store state to ensure Chat Sidebar opens immediately and shows correct conversation
        setActiveConversation(conversation);
        openChat();

        // Navigate to chat page to keep URL in sync
        navigate(`/chat?conversationId=${conversation.id}`);

        // Optimistically mark as read in UI (store update happens in ChatPage/useEffect too)
        if (conversation.unreadCount > 0) {
            markAsRead(conversation.id);
        }
    };

    const handleMarkAllRead = () => {
        // Implement if backend supports it, or just iterate (not implemented in this snippet as distinct requirement)
    };

    // Sort conversations: Unread first, then by last message time
    const sortedConversations = [...conversations].sort((a, b) => {
        // If one has unread and other doesn't, prioritize unread
        const aUnread = (a.unreadCount || 0) > 0;
        const bUnread = (b.unreadCount || 0) > 0;
        if (aUnread && !bUnread) return -1;
        if (!aUnread && bUnread) return 1;

        // Otherwise sort by time (newest first)
        const dateA = new Date(a.lastMessageTime || 0);
        const dateB = new Date(b.lastMessageTime || 0);
        return dateB - dateA;
    });


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Messages"
            >
                {/* Use a filled icon style similar to Messenger if desired, FiMessageCircle is close */}
                <FiMessageCircle size={24} className={isOpen ? "fill-current" : ""} />

                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
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
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 overflow-hidden z-50"
                    >
                        <div className="px-4 py-3 border-b border-slate-50 bg-white flex justify-between items-center sticky top-0 z-10">
                            <h3 className="text-lg font-bold text-slate-900">Chats</h3>
                            {/* Optional: Add 'Mark all read' or 'New Message' actions here */}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {sortedConversations.length > 0 ? (
                                sortedConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => handleConversationClick(conversation)}
                                        className={clsx(
                                            "group px-3 py-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors relative mx-2 rounded-lg my-1",
                                            // Highlight unread conversations subtly
                                            (conversation.unreadCount > 0) ? "bg-blue-50/30" : ""
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 relative">
                                            {conversation.otherUserAvatar ? (
                                                <img
                                                    src={conversation.otherUserAvatar}
                                                    alt={conversation.otherUserName}
                                                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {conversation.otherUserName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            {/* Online Status (Mocked for now as we don't have real-time online status in store yet) */}
                                            {/* <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className={clsx(
                                                    "text-sm truncate pr-2",
                                                    (conversation.unreadCount > 0) ? "font-bold text-slate-900" : "font-medium text-slate-800"
                                                )}>
                                                    {conversation.otherUserName}
                                                </h4>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <p className={clsx(
                                                    "text-xs truncate max-w-[180px]",
                                                    (conversation.unreadCount > 0) ? "text-slate-900 font-semibold" : "text-slate-500"
                                                )}>
                                                    {conversation.lastMessage || "Started a conversation"}
                                                </p>

                                                <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                                                    {conversation.lastMessageTime && formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: false })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Unread Indicator Dot */}
                                        {conversation.unreadCount > 0 && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-12 text-center flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <FiMessageCircle size={32} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">No conversations yet</p>
                                    <p className="text-xs mt-1">Start chatting with friends!</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-slate-50 text-center bg-slate-50/50">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/chat');
                                }}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline transition-all"
                            >
                                See all in Messenger
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessagesDropdown;
