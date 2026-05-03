/**
 * Payment constants
 */

export const CURRENCIES = [
    { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
];

export const PAYMENT_PROVIDER_IDS = {
    SWIFT: 'SWIFT',
    PAYPAL: 'PayPal',
    STRIPE: 'Stripe',
};

export const PAYMENT_ENDPOINTS = {
    PROCESS: '/Payment/process',
};

export const DEFAULT_CURRENCY = 'USD';
