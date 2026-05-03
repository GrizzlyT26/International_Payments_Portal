/**
 * usePayment hook
 * Custom hook for payment logic
 */

import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [result, setResult] = useState(null);

    const processPayment = useCallback(async (paymentData) => {
        setLoading(true);
        setError('');
        setSuccess('');
        setResult(null);

        try {
            const result = await paymentService.processPayment(paymentData);

            if (result.success) {
                setSuccess('Payment processed successfully!');
                setResult(result.data);
                return { success: true, data: result.data };
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
    }, []);

    const clearMessages = useCallback(() => {
        setError('');
        setSuccess('');
    }, []);

    return {
        loading,
        error,
        success,
        result,
        processPayment,
        clearMessages,
    };
};

export default usePayment;
