/**
 * Payment validation utilities
 */

export const validateIBAN = (iban) => {
    if (!iban) return false;
    return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/i.test(iban);
};

export const validateSWIFT = (swift) => {
    if (!swift) return false;
    return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(swift);
};

export const validateAmount = (amount) => {
    if (!amount) return false;
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 1_000_000;
};

export const validatePaymentForm = (formData) => {
    const errors = {};

    if (!validateIBAN(formData.receiverIBAN)) {
        errors.receiverIBAN = 'Invalid IBAN format (e.g., DE89370400440532013000)';
    }

    if (!validateSWIFT(formData.receiverSWIFT)) {
        errors.receiverSWIFT = 'Invalid SWIFT code format (e.g., DEUTDEFF)';
    }

    if (!validateAmount(formData.amount)) {
        errors.amount = 'Amount must be between 0.01 and 1,000,000';
    }

    if (!formData.currency) {
        errors.currency = 'Please select a currency';
    }

    return errors;
};
