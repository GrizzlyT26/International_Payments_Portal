/**
 * Payment provider helpers
 */

import { SwiftProviderIcon, PayPalProviderIcon, StripeProviderIcon } from './PaymentProviderIcons';

export const getPaymentProviders = () => [
    {
        id: "SWIFT",
        label: "SWIFT",
        desc: "Bank wire",
        icon: <SwiftProviderIcon />,
    },
    {
        id: "PayPal",
        label: "PayPal",
        desc: "P2P payments",
        icon: <PayPalProviderIcon />,
    },
    {
        id: "Stripe",
        label: "Stripe",
        desc: "Card processing",
        icon: <StripeProviderIcon />,
    },
];
