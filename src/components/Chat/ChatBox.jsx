import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaComments } from 'react-icons/fa';
import useChatStore from '../../hooks/useChatStore';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

/**
 * ChatBox Component
 * Main chat interface with floating window
 */
const ChatBox = () => {
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
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FaComments className="text-xl" />
                            <h2 className="font-bold text-lg">
                                {activeConversation ? 'Chat' : 'Messages'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Connection Status */}
                            <div
                                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'
                                    }`}
                                title={isConnected ? 'Connected' : 'Disconnected'}
                            />
                            <button
                                onClick={closeChat}
                                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {activeConversation ? <ChatWindow /> : <ConversationList />}
                    </div>

                    {/* Connection Warning */}
                    {!isConnected && (
                        <div className="bg-yellow-100 text-yellow-800 text-xs p-2 text-center">
                            Reconnecting to chat server...
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatBox;
