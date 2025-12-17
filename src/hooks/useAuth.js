import { create } from 'zustand';
import { useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';

// Zustand store for auth state
const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
    setLoading: (loading) => set({ loading }),
    logout: () => set({ user: null, isAuthenticated: false, loading: false }),
}));

export const useAuth = () => {
    const { user, isAuthenticated, loading, setUser, setLoading, logout: logoutAction } = useAuthStore();

    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            const response = await authAPI.login({ email, password });

            // Backend returns ApiResponse<AuthResponse>
            // response.data = ApiResponse { success, message, data: AuthResponse }
            // AuthResponse = { token, refreshToken, user, expiresIn }
            const { token, refreshToken, user } = response.data.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                setUser(user); // Use user data from response directly
                return user;
            } else {
                throw new Error("Token not found in response");
            }
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setUser]);

    const register = useCallback(async (data) => {
        try {
            setLoading(true);
            const response = await authAPI.register(data);
            const { token, refreshToken, user } = response.data.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                setUser(user);
                return user;
            } else {
                throw new Error("Token not found in response");
            }
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setUser]);

    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            logoutAction();
        }
    }, [logoutAction]);

    // Check auth status on mount (simple version)
    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await userAPI.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            logoutAction();
        } finally {
            setLoading(false);
        }
    }, [setLoading, setUser, logoutAction]);

    return { user, isAuthenticated, loading, login, register, logout, checkAuth };
};
