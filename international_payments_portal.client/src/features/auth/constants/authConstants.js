/**
 * Authentication constants
 */

export const AUTH_ENDPOINTS = {
    REGISTER: '/Auth/register',
    LOGIN: '/Auth/login',
};

export const AUTH_STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER: 'user',
};

export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
};
