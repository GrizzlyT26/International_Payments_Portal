/**
 * Customer validation utilities
 */

export const validateAccountNumber = (accountNumber) => {
    if (!accountNumber) return false;

    // Must be exactly 13 digits
    return /^[0-9]{13}$/.test(accountNumber);
};

export const validateBranchCode = (branchCode) => {
    if (!branchCode) return false;

    // Must be exactly 6 digits
    return /^[0-9]{6}$/.test(branchCode);
};

export const validateCustomerForm = (formData) => {
    const errors = {};

    if (!formData.accountHolder) {
        errors.accountHolder = "Account holder is required";
    }

    if (!validateAccountNumber(formData.accountNumber)) {
        errors.accountNumber = "Account number must be exactly 13 digits";
    }

    if (!validateBranchCode(formData.branchCode)) {
        errors.branchCode = "Branch code must be exactly 6 digits";
    }

    return errors;
};