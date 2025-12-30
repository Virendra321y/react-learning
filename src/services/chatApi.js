import apiClient from './api';

/**
 * Chat API Service
 * Handles HTTP requests for chat functionality using common apiClient
 */

/**
 * Get all conversations for current user
 */
export const getConversations = async (page = 0, size = 20) => {
    const response = await apiClient.get('/chat/conversations', {
        params: { page, size },
    });
    return response.data;
};

/**
 * Get messages in a conversation
 */
export const getMessages = async (conversationId, page = 0, size = 50) => {
    const response = await apiClient.get(
        `/chat/conversations/${conversationId}/messages`,
        {
            params: { page, size },
        }
    );
    return response.data;
};

/**
 * Mark messages in a conversation as read
 */
export const markAsRead = async (conversationId) => {
    const response = await apiClient.post(
        `/chat/conversations/${conversationId}/read`,
        {}
    );
    return response.data;
};

/**
 * Get total unread message count
 */
export const getUnreadCount = async () => {
    const response = await apiClient.get('/chat/unread-count');
    return response.data;
};

/**
 * Check if can chat with a user
 */
export const canChatWith = async (userId) => {
    const response = await apiClient.get(`/chat/can-chat/${userId}`);
    return response.data;
};

export const chatAPI = {
    getConversations,
    getMessages,
    markAsRead,
    getUnreadCount,
    canChatWith,
};

export default chatAPI;
