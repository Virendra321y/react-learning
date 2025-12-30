import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaComments } from 'react-icons/fa';
import useChatStore from '../../hooks/useChatStore';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

/**
 * ChatSidebar Component
 * Drawer-style chat interface that slides in from the left
 */
const ChatSidebar = () => {
    const {
        isChatOpen,
        activeConversation,
        isConnected,
        closeChat,
        fetchConversations,
    } = useChatStore();

    useEffect(() => {
        if (isChatOpen && isConnected) {
            fetchConversations();
        }
    }, [isChatOpen, isConnected]);

    return (
        <AnimatePresence>
            {isChatOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChat}
                        className="fixed inset-0 bg-black/10 z-[90]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[100%] sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-[100] flex flex-col border-l border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between shadow-md">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <FaComments className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg leading-none">
                                        {activeConversation ? 'Chat' : 'Messages'}
                                    </h2>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                                        <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">
                                            {isConnected ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeChat}
                                className="hover:bg-white/20 p-2 rounded-full transition-all duration-200 group"
                            >
                                <FaTimes className="group-hover:rotate-90 transition-transform duration-200" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            {activeConversation ? <ChatWindow /> : <ConversationList />}
                        </div>

                        {/* Status Footer */}
                        {!isConnected && (
                            <div className="bg-amber-50 text-amber-700 text-[10px] py-1.5 px-3 text-center border-t border-amber-100 font-medium italic">
                                Reconnecting to secure chat server...
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatSidebar;
