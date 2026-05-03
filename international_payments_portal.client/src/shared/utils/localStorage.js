/**
 * Local Storage utility functions
 * Provides type-safe access to localStorage
 */

export const storage = {
    // Auth
    setAuthToken: (token) => localStorage.setItem('authToken', token),
    getAuthToken: () => localStorage.getItem('authToken'),
    removeAuthToken: () => localStorage.removeItem('authToken'),

    // User data
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUser: () => localStorage.removeItem('user'),

    // Generic methods
    setItem: (key, value) => {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    },
    getItem: (key) => {
        const value = localStorage.getItem(key);
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    },
    removeItem: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
};

export default storage;
