import apiClient from './api';

export const userAPI = {
    // Search users
    search: (query, page = 0, size = 10) =>
        apiClient.get('/users/search', { params: { q: query, page, size } }),

    // Get user by ID
    getById: (id) => apiClient.get(`/users/${id}`),

    // Get current user (me)
    getCurrentUser: () => apiClient.get('/users/me'),

    // Get user statistics
    getStatistics: (id) => apiClient.get(`/users/${id}/statistics`),

    // Update user profile
    update: (id, data) => apiClient.put(`/users/${id}`, data),

    // Change password
    changePassword: (id, data) => apiClient.put(`/users/${id}/password`, data),

    // Upload avatar
    uploadAvatar: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post(`/users/${id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Follow a user
    follow: (userId) => apiClient.post(`/users/${userId}/follow`),

    // Unfollow a user
    unfollow: (userId) => apiClient.post(`/users/${userId}/unfollow`),

    // Check if following
    checkFollowStatus: (userId) => apiClient.get(`/users/${userId}/is-following`),

    // Get followers list
    getFollowers: (userId, page = 0, size = 10) =>
        apiClient.get(`/users/${userId}/followers`, { params: { page, size } }),

    // Get following list
    getFollowing: (userId, page = 0, size = 10) =>
        apiClient.get(`/users/${userId}/following`, { params: { page, size } }),
};
