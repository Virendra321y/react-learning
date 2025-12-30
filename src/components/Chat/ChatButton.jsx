import React, { useState, useEffect } from 'react';
import { FaComment } from 'react-icons/fa';
import { canChatWith } from '../../services/chatApi';
import useChatStore from '../../hooks/useChatStore';

/**
 * ChatButton Component
 * Button to start chat with a user (only shown for mutual follows)
 */
const ChatButton = ({ userId, userName, userAvatar }) => {
    const [canChat, setCanChat] = useState(false);
    const [loading, setLoading] = useState(true);
    const { openChatWithUser } = useChatStore();

    useEffect(() => {
        checkChatPermission();
    }, [userId]);

    const checkChatPermission = async () => {
        try {
            setLoading(true);
            const response = await canChatWith(userId);
            setCanChat(response.data);
        } catch (error) {
            console.error('Error checking chat permission:', error);
            setCanChat(false);
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = () => {
        openChatWithUser(userId, userName, userAvatar);
    };

    if (loading) {
        return (
            <button
                disabled
                className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
            >
                <FaComment className="inline mr-2" />
                Loading...
            </button>
        );
    }

    if (!canChat) {
        return null; // Don't show button if can't chat
    }

    return (
        <button
            onClick={handleChatClick}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
            <FaComment />
            <span>Message</span>
        </button>
    );
};

export default ChatButton;
