import React from 'react';
import { motion } from 'framer-motion';
import useChatStore from '../../hooks/useChatStore';

/**
 * ConversationList Component
 * Displays list of conversations
 */
const ConversationList = () => {
    const { conversations, setActiveConversation, isLoading } = useChatStore();

    const handleSelectConversation = (conversation) => {
        setActiveConversation(conversation);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                <p className="text-center">No conversations yet</p>
                <p className="text-sm text-center mt-2">
                    Start chatting with users you mutually follow
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
                <motion.div
                    key={conversation.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleSelectConversation(conversation)}
                    className="flex items-center space-x-3 p-4 border-b border-gray-200 cursor-pointer transition-colors"
                >
                    {/* Avatar */}
                    {conversation.otherUserAvatar ? (
                        <img
                            src={conversation.otherUserAvatar}
                            alt={conversation.otherUserName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                            {conversation.otherUserName?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800 truncate">
                                {conversation.otherUserName}
                            </h4>
                            {conversation.lastMessageTime && (
                                <span className="text-xs text-gray-400">
                                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage || 'No messages yet'}
                        </p>
                    </div>

                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default ConversationList;
