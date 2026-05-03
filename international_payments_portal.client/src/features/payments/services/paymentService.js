import axios from "axios";

const API_URL = "https://localhost:5001/api/payment";

export const paymentService = {
    processPayment: async (paymentData) => {
        try {
            const response = await axios.post(
                `${API_URL}/process`,
                {
                    userId: paymentData.userId || 1, // fallback
                    receiverIBAN: paymentData.receiverIBAN,
                    receiverSWIFT: paymentData.receiverSWIFT,
                    amount: parseFloat(paymentData.amount),
                    currency: paymentData.currency,
                    description: paymentData.description
                }
            );

            return {
                success: true,
                data: response.data
            };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Payment failed"
            };
        }
    }
};