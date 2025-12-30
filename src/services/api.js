import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                isRefreshing = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }

            try {
                // Use a separate instance or raw axios to avoid interceptor loop
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
                const { token } = response.data.data;

                if (token) {
                    localStorage.setItem('token', token);
                    if (response.data.data.refreshToken) {
                        localStorage.setItem('refreshToken', response.data.data.refreshToken);
                    }

                    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

                    processQueue(null, token);
                    isRefreshing = false;

                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    logout: () => apiClient.post('/auth/logout'),
    refreshToken: (refreshToken) => apiClient.post('/auth/refresh-token', { refreshToken }),
    promoteMe: () => apiClient.post('/auth/promote-me'),
};

export const userAPI = {
    getCurrentUser: () => apiClient.get('/users/me'),
};

export const notificationAPI = {
    getNotifications: (page = 0, size = 10) => apiClient.get('/notifications', { params: { page, size } }),
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
};

export const bookmarkAPI = {
    bookmark: (postId) => apiClient.post(`/bookmarks/post/${postId}`),
    unbookmark: (postId) => apiClient.delete(`/bookmarks/post/${postId}`),
    getBookmarkedPosts: (page = 0, size = 10) => apiClient.get('/bookmarks', { params: { page, size } }),
    getStatus: (postId) => apiClient.get(`/bookmarks/post/${postId}/status`),
};

export const adminAPI = {
    getStats: () => apiClient.get('/admin/stats'),
    getAllUsers: (page = 0, size = 10) => apiClient.get('/admin/users', { params: { page, size } }),
    updateUserStatus: (userId, status) => apiClient.put(`/admin/users/${userId}/status`, null, { params: { status } }),
};

export default apiClient;
