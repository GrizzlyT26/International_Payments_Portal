/**
 * PaymentForm component
 * Main form for processing international payments
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankIcon, SwiftIcon, AmountIcon, NoteIcon } from '../../../shared/components/icons';
import { paymentStyles, handleInputFocus, handleInputBlur } from '../styles/paymentStyles';
import { validatePaymentForm } from '../validation/paymentValidation';
import { CURRENCIES } from '../constants/paymentConstants';
import { getPaymentProviders } from './getPaymentProviders';
import { usePayment } from '../hooks/usePayment';
import { storage } from '../../../shared/utils/localStorage';

export const PaymentForm = () => {
    const navigate = useNavigate();
    const { processPayment, loading, error, success, clearMessages } = usePayment();
    const [selectedProvider, setSelectedProvider] = useState('SWIFT');
    const [formData, setFormData] = useState({
        receiverIBAN: '',
        receiverSWIFT: '',
        amount: '',
        currency: 'USD',
        description: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const PAYMENT_PROVIDERS = getPaymentProviders();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();

        // Validate form
        const errors = validatePaymentForm(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});

        // Attach logged-in user id to payment payload (falls back to 1)
        const currentUser = storage.getUser();
        const paymentPayload = {
            ...formData,
            userId: currentUser?.Id ?? currentUser?.id ?? 1
        };

        // Process payment through API
        const result = await processPayment(paymentPayload);

        if (result && !error) {
            // Prepare user data for verification (use stored auth user if available)
            const storedUser = storage.getUser();
            const userData = {
                name: storedUser?.FullName || localStorage.getItem('userName') || 'Kamogelo Sithole',
                accountNumber: localStorage.getItem('accountNumber') || '          4821',
                branchCode: localStorage.getItem('branchCode') || '632005',
                accountType: localStorage.getItem('accountType') || 'Cheque'
            };

            // Prepare payment data for verification page
            const paymentData = {
                paymentMethod: selectedProvider,
                receiverIban: formData.receiverIBAN,
                receiverSwiftCode: formData.receiverSWIFT,
                amount: formData.amount,
                currency: formData.currency,
                description: formData.description
            };

            // Navigate to verification page with payment data
            navigate('/verification', {
                state: {
                    paymentData: paymentData,
                    userData: userData
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {/* Error message */}
            {error && <div style={paymentStyles.errBox}>{error}</div>}
            {success && <div style={paymentStyles.successBox}>{success}</div>}

            {/* Payment Provider Selection */}
            <label style={{ ...paymentStyles.label, marginBottom: 12 }}>Payment Method</label>
            <div style={paymentStyles.providerGrid}>
                {PAYMENT_PROVIDERS.map(prov => (
                    <div
                        key={prov.id}
                        onClick={() => setSelectedProvider(prov.id)}
                        style={{
                            ...paymentStyles.providerCard,
                            background: selectedProvider === prov.id
                                ? 'rgba(37,99,235,0.15)'
                                : 'rgba(255,255,255,0.03)',
                            borderColor: selectedProvider === prov.id
                                ? 'rgba(37,99,235,0.5)'
                                : 'rgba(99,179,237,0.13)',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{ marginBottom: 8 }}>{prov.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
                            {prov.label}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{prov.desc}</div>
                    </div>
                ))}
            </div>

            {/* Receiver IBAN */}
            <label style={paymentStyles.label}>Receiver IBAN</label>
            <div style={paymentStyles.inputWrap}>
                <div style={paymentStyles.iconSlot}>
                    <BankIcon />
                </div>
                <input
                    type="text"
                    name="receiverIBAN"
                    placeholder="e.g., DE89370400440532013000"
                    value={formData.receiverIBAN}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                        ...paymentStyles.input,
                        borderColor: fieldErrors.receiverIBAN
                            ? 'rgba(239,68,68,0.5)'
                            : 'rgba(99,179,237,0.13)',
                    }}
                />
            </div>
            {fieldErrors.receiverIBAN && (
                <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 12 }}>
                    {fieldErrors.receiverIBAN}
                </div>
            )}

            {/* Receiver SWIFT */}
            <label style={paymentStyles.label}>Receiver SWIFT Code</label>
            <div style={paymentStyles.inputWrap}>
                <div style={paymentStyles.iconSlot}>
                    <SwiftIcon />
                </div>
                <input
                    type="text"
                    name="receiverSWIFT"
                    placeholder="e.g., DEUTDEFF"
                    value={formData.receiverSWIFT}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                        ...paymentStyles.input,
                        borderColor: fieldErrors.receiverSWIFT
                            ? 'rgba(239,68,68,0.5)'
                            : 'rgba(99,179,237,0.13)',
                    }}
                />
            </div>
            {fieldErrors.receiverSWIFT && (
                <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 12 }}>
                    {fieldErrors.receiverSWIFT}
                </div>
            )}

            {/* Amount & Currency */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                    <label style={paymentStyles.label}>Amount</label>
                    <div style={paymentStyles.inputWrap}>
                        <div style={paymentStyles.iconSlot}>
                            <AmountIcon />
                        </div>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            step="0.01"
                            min="0"
                            style={{
                                ...paymentStyles.input,
                                borderColor: fieldErrors.amount
                                    ? 'rgba(239,68,68,0.5)'
                                    : 'rgba(99,179,237,0.13)',
                            }}
                        />
                    </div>
                    {fieldErrors.amount && (
                        <div style={{ color: '#fca5a5', fontSize: 12 }}>
                            {fieldErrors.amount}
                        </div>
                    )}
                </div>

                <div>
                    <label style={paymentStyles.label}>Currency</label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={paymentStyles.select}
                    >
                        {CURRENCIES.map(curr => (
                            <option key={curr.code} value={curr.code}>
                                {curr.flag} {curr.code}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Description */}
            <label style={{ ...paymentStyles.label, marginTop: 14 }}>Description (Optional)</label>
            <div style={paymentStyles.inputWrap}>
                <div style={paymentStyles.iconSlot}>
                    <NoteIcon />
                </div>
                <textarea
                    name="description"
                    placeholder="Payment reference or note"
                    value={formData.description}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                        ...paymentStyles.textarea,
                        paddingLeft: '42px',
                    }}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                style={{
                    ...paymentStyles.btn,
                    marginTop: 24,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Processing Payment...' : 'Continue to Verification'}
            </button>
        </form>
    );
};

export default PaymentForm;