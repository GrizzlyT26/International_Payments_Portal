/**
 * Auth service for API calls
 * Handles login and registration
 */

import apiClient from '../../../shared/utils/apiClient';
import { AUTH_ENDPOINTS } from '../constants/authConstants';

export const authService = {
    /**
     * Register a new user
     */
    register: async (data) => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, {
                Email: data.email,
                FullName: data.fullName,
                Password: data.password,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed',
            };
        }
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
                Email: credentials.email,
                Password: credentials.password,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid credentials',
            };
        }
    },

    /**
     * Logout user (local cleanup)
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
};

export default authService;
