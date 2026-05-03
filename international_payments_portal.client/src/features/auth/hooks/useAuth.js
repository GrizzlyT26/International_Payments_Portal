/**
 * useAuth hook
 * Custom hook for authentication logic
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { storage } from '../../../shared/utils/localStorage';

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const register = useCallback(async (formData) => {
        setLoading(true);
        setError('');

        try {
            const result = await authService.register(formData);

            if (result.success) {
                // Redirect to login after successful registration
                navigate('/login');
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const errorMsg = err.message || 'An unexpected error occurred';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError('');

        try {
            const result = await authService.login(credentials);

            if (result.success) {
                // Store token and user data
                storage.setAuthToken(result.data.token);
                if (result.data.user) {
                    storage.setUser(result.data.user);
                    // Store the role
                    localStorage.setItem('userRole', result.data.user.role || 'customer');
                }

                // Redirect to appropriate page based on role
                const role = result.data.user?.role || 'customer';
                if (role === 'staff') {
                    navigate('/staff-dashboard');
                } else {
                    navigate('/portal');
                }
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const errorMsg = err.message || 'An unexpected error occurred';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = useCallback(() => {
        authService.logout();
        storage.removeAuthToken();
        storage.removeUser();
        localStorage.removeItem('userRole');
        navigate('/login');
    }, [navigate]);

    return {
        loading,
        error,
        register,
        login,
        logout,
    };
};

export default useAuth;
