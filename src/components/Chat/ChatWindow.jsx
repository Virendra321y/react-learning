import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';
import useChatStore from '../../hooks/useChatStore';
import { useAuth } from '../../hooks/useAuth';

/**
 * ChatWindow Component
 * Displays active conversation with messages and input
 */
const ChatWindow = () => {
    const { user: currentUser } = useAuth();
    const {
        activeConversation,
        messages,
        fetchMessages,
        sendMessage,
        markAsRead,
        setActiveConversation,
    } = useChatStore();

    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const currentUserId = currentUser?.id;

    useEffect(() => {
        if (activeConversation?.id) {
            fetchMessages(activeConversation.id);
            markAsRead(activeConversation.id);
            // Autofocus when switching conversations
            inputRef.current?.focus();
        }
    }, [activeConversation?.id]);

    // Always focus back when sending becomes false
    useEffect(() => {
        if (!sending) {
            inputRef.current?.focus();
        }
    }, [sending]);

    useEffect(() => {
        scrollToBottom();
    }, [messages[activeConversation?.id]]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeConversation) {
            console.log('Cannot send message: empty input or no active conversation');
            return;
        }

        try {
            setSending(true);
            console.log('Sending message to user:', activeConversation.otherUserId);

            // Ensure we are connected before trying to send
            await sendMessage(activeConversation.otherUserId, messageInput.trim());

            console.log('Message sent successfully through store');
            setMessageInput('');
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
            alert(`Failed to send message: ${error.message}`);
        } finally {
            setSending(false);
            // Focus is also handled by the useEffect above
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const conversationMessages = messages[activeConversation?.id] || [];

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex items-center space-x-3">
                    {activeConversation?.otherUserAvatar ? (
                        <img
                            src={activeConversation.otherUserAvatar}
                            alt={activeConversation.otherUserName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
                            {activeConversation?.otherUserName?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-white">
                            {activeConversation?.otherUserName}
                        </h3>
                        <p className="text-xs text-blue-100">Active now</p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveConversation(null)}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {conversationMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    conversationMessages.map((msg, index) => {
                        const isSender = Number(msg.senderId) === Number(currentUserId);
                        return (
                            <motion.div
                                key={msg.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm relative group transition-all duration-200 ${isSender
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none'
                                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                                    <div className={`flex items-center gap-1.5 mt-1 justify-end ${isSender ? 'text-indigo-100' : 'text-slate-400'}`}>
                                        <span className="text-[10px] font-medium opacity-80 uppercase">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                        {isSender && (
                                            <div className="flex items-center">
                                                {msg.readStatus ? (
                                                    <IoCheckmarkDone className="text-blue-400 text-base" />
                                                ) : (
                                                    <IoCheckmark className="text-slate-300 text-base" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={sending}
                        maxLength={5000}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                    {messageInput.length}/5000
                </p>
            </div>
        </div>
    );
};

export default ChatWindow;
