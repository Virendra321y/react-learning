import apiClient from './api';

/**
 * Post API Service
 * Handles all post-related API calls
 */
export const postAPI = {
    /**
     * Create a new post
     * @param {Object} data - Post data (title, content, status)
     * @returns {Promise} API response
     */
    create: (data) => apiClient.post('/posts', data),

    /**
     * Get all posts with pagination
     * @param {number} page - Page number (default: 0)
     * @param {number} size - Page size (default: 10)
     * @returns {Promise} API response with paginated posts
     */
    getAll: (page = 0, size = 10) =>
        apiClient.get('/posts', { params: { page, size } }),

    /**
     * Get a single post by ID
     * @param {number} id - Post ID
     * @returns {Promise} API response with post details
     */
    getById: (id) => apiClient.get(`/posts/${id}`),

    /**
     * Update an existing post (author only)
     * @param {number} id - Post ID
     * @param {Object} data - Updated post data
     * @returns {Promise} API response
     */
    update: (id, data) => apiClient.put(`/posts/${id}`, data),

    /**
     * Delete a post (author only)
     * @param {number} id - Post ID
     * @returns {Promise} API response
     */
    delete: (id) => apiClient.delete(`/posts/${id}`),

    /**
     * Toggle like on a post
     * @param {number} id - Post ID
     * @returns {Promise} API response
     */
    toggleLike: (id) => apiClient.post(`/posts/${id}/like`),


    /**
     * Search posts by query
     * @param {string} query - Search query
     * @param {number} page - Page number (default: 0)
     * @param {number} size - Page size (default: 10)
     * @returns {Promise} API response with search results
     */
    search: (query, page = 0, size = 10) =>
        apiClient.get('/posts/search', { params: { q: query, page, size } }),

    /**
     * Get posts by user ID
     * @param {number} userId - User ID
     * @param {number} page - Page number (default: 0)
     * @param {number} size - Page size (default: 10)
     * @returns {Promise} API response with user's posts
     */
    getByUserId: (userId, page = 0, size = 10) =>
        apiClient.get(`/users/${userId}/posts`, { params: { page, size } }),
};

export default postAPI;
