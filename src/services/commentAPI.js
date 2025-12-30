import apiClient from './api';

/**
 * Comment API Service
 * Handles all comment-related API operations
 */

/**
 * Fetch all comments for a specific post
 * @param {number} postId - The ID of the post
 * @returns {Promise<Array>} Array of comment objects
 */
export const getPostComments = async (postId) => {
    try {
        const response = await apiClient.get(`/posts/${postId}/comments`);
        return response.data.data.content;
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        throw error;
    }
};

/**
 * Fetch a single comment by ID
 * @param {number} commentId - The ID of the comment
 * @returns {Promise<Object>} Comment object
 */
export const getCommentById = async (commentId) => {
    try {
        const response = await apiClient.get(`/comments/${commentId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching comment ${commentId}:`, error);
        throw error;
    }
};

/**
 * Create a new comment on a post
 * @param {number} postId - The ID of the post
 * @param {Object} data - Comment data
 * @param {string} data.content - The comment content
 * @returns {Promise<Object>} Created comment object
 */
export const createComment = async (postId, data) => {
    try {
        const response = await apiClient.post(`/posts/${postId}/comments`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error creating comment on post ${postId}:`, error);
        throw error;
    }
};

/**
 * Update an existing comment
 * @param {number} commentId - The ID of the comment to update
 * @param {Object} data - Updated comment data
 * @param {string} data.content - The updated comment content
 * @returns {Promise<Object>} Updated comment object
 */
export const updateComment = async (commentId, data) => {
    try {
        const response = await apiClient.put(`/comments/${commentId}`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating comment ${commentId}:`, error);
        throw error;
    }
};

/**
 * Delete a comment
 * @param {number} commentId - The ID of the comment to delete
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
    try {
        const response = await apiClient.delete(`/comments/${commentId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error deleting comment ${commentId}:`, error);
        throw error;
    }
};

export default {
    getPostComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
};
