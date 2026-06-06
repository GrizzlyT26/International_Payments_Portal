import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobeIcon, LogoutIcon } from '../../../shared/components/icons';
import { paymentService } from '../../payments/services/paymentService';
import { paymentStyles } from '../../payments/styles/paymentStyles';

// Styles
const verificationStyles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #020818 0%, #0a1628 55%, #0d2045 100%)",
        fontFamily: "'Sora', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "40px 16px",
        boxSizing: "border-box",
    },
    orb: (w, top, left, delay, color = "rgba(37,99,235,0.14)") => ({
        position: "absolute",
        width: w,
        height: w,
        borderRadius: "50%",
        top,
        left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        animation: `floatOrb 8s ease-in-out ${delay} infinite`,
        pointerEvents: "none",
        zIndex: 0,
    }),
    card: {
        width: "100%",
        maxWidth: 460,
        borderRadius: 22,
        padding: "36px 32px 32px",
        background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(99,179,237,0.13)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 1,
        animation: "fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
        boxSizing: "border-box",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    logoRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    globeIcon: {
        width: 30,
        height: 30,
        color: "#60a5fa",
    },
    title: {
        color: "#e2e8f0",
        fontSize: 22,
        fontWeight: 700,
        margin: 0,
        letterSpacing: "-0.4px",
    },
    logoutBtn: {
        background: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#fca5a5",
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 7,
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: "'Sora', system-ui, sans-serif",
        letterSpacing: "0.03em",
        transition: "background 0.2s",
    },
    editBtn: {
        background: "rgba(59,130,246,0.15)",
        border: "1px solid rgba(59,130,246,0.3)",
        color: "#93c5fd",
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 7,
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: "'Sora', system-ui, sans-serif",
        letterSpacing: "0.03em",
        transition: "background 0.2s",
    },
    welcome: {
        color: "#64748b",
        fontSize: 12,
        margin: "0 0 24px 0",
    },
    sectionLabel: {
        color: "#64748b",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 12,
    },
    divider: {
        border: "none",
        borderTop: "1px solid rgba(99,179,237,0.1)",
        margin: "20px 0",
    },
    rows: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    row: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 0",
        borderBottom: "1px solid rgba(99,179,237,0.07)",
    },
    rowLast: {
        borderBottom: "none",
    },
    rowLabel: {
        color: "#64748b",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.02em",
        flexShrink: 0,
    },
    rowValue: {
        color: "#e2e8f0",
        fontSize: 13,
        fontWeight: 500,
        textAlign: "right",
        wordBreak: "break-all",
        maxWidth: "60%",
    },
    badge: {
        background: "rgba(37,99,235,0.18)",
        border: "1px solid rgba(59,130,246,0.25)",
        color: "#93c5fd",
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        padding: "3px 9px",
        letterSpacing: "0.03em",
        display: "inline-block",
    },
    amountValue: {
        color: "#38bdf8",
        fontSize: 15,
        fontWeight: 700,
    },
    btn: {
        width: "100%",
        marginTop: 24,
        padding: 13,
        border: "none",
        borderRadius: 11,
        color: "white",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'Sora', system-ui, sans-serif",
        background: "linear-gradient(90deg, #1e40af, #2563eb, #38bdf8, #2563eb, #1e40af)",
        backgroundSize: "250% 100%",
        animation: "shimmer 3.5s linear infinite",
        letterSpacing: "0.03em",
        transition: "transform 0.15s, box-shadow 0.2s",
        boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
    },
    notice: {
        marginTop: 14,
        display: "flex",
        alignItems: "center",
        gap: 7,
        justifyContent: "center",
    },
    noticeDot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#22c55e",
        flexShrink: 0,
    },
    noticeText: {
        color: "#64748b",
        fontSize: 11,
        letterSpacing: "0.02em",
    },
    successBox: {
        background: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 18,
        color: "#86efac",
        fontSize: 13,
        textAlign: "center",
    },
};

const keyframes = `
    @keyframes floatOrb {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-18px); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shimmer {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
    }
`;

const VerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get payment data from navigation state
    const { paymentData: passedPaymentData, userData: passedUserData } = location.state || {};

    // Use passed data or fallback to default data
    const [userData] = useState(
        passedUserData || {
            name: localStorage.getItem('userName') || 'Kamogelo Sithole',
            accountNumber: localStorage.getItem('accountNumber') || '•••• •••• 4821',
            branchCode: localStorage.getItem('branchCode') || '632005',
            accountType: localStorage.getItem('accountType') || 'Cheque'
        }
    );

    const [paymentData] = useState(
        passedPaymentData || {
            paymentMethod: 'SWIFT',
            receiverIban: localStorage.getItem('lastIBAN') || 'GB29 NWBK 6016 1331 9268 19',
            receiverSwiftCode: localStorage.getItem('lastSWIFT') || 'DEUTDEFF',
            amount: '0.00',
            currency: 'USD',
            description: ''
        }
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submittedTransactionId, setSubmittedTransactionId] = useState('');

    const handleLogout = () => {
        navigate('/login');
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        const result = await paymentService.processPayment({
            userId: paymentData.userId,
            receiverIBAN: paymentData.receiverIBAN || paymentData.receiverIban,
            receiverSWIFT: paymentData.receiverSWIFT || paymentData.receiverSwiftCode,
            amount: paymentData.amount,
            currency: paymentData.currency,
            description: paymentData.description,
        });

        if (result.success) {
            setSubmittedTransactionId(result.data.transactionId);
        } else {
            setSubmitError(result.error || 'Unable to submit payment.');
        }

        setIsSubmitting(false);
    };

    const handleEdit = () => {
        // Navigate back to payment portal
        navigate('/portal');
    };

    const formattedAmount = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: paymentData.currency || 'USD',
    }).format(Number(paymentData.amount || 0));

    // Inject keyframes into document
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const handleLogoutHover = (e, isEnter) => {
        if (isEnter) {
            e.target.style.background = "rgba(239,68,68,0.25)";
        } else {
            e.target.style.background = "rgba(239,68,68,0.15)";
        }
    };

    const handleEditHover = (e, isEnter) => {
        if (isEnter) {
            e.target.style.background = "rgba(59,130,246,0.25)";
        } else {
            e.target.style.background = "rgba(59,130,246,0.15)";
        }
    };

    const handleButtonHover = (e, isEnter) => {
        if (isEnter) {
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 6px 28px rgba(37,99,235,0.5)";
        } else {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(37,99,235,0.4)";
        }
    };

    return (
        <div style={paymentStyles.page}>
            {/* Animated background orbs */}
            <div style={paymentStyles.orb(500, '-18%', '-14%', '0s', 'rgba(37,99,235,0.14)')} />
            <div style={paymentStyles.orb(320, '55%', '65%', '2s', 'rgba(14,165,233,0.09)')} />
            <div style={paymentStyles.orb(260, '10%', '72%', '4s', 'rgba(99,102,241,0.08)')} />

            <div style={paymentStyles.card}>
                {/* Header */}
                <div style={paymentStyles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <GlobeIcon size={32} />
                        <div>
                            <h1 style={paymentStyles.title}>Payment Verification</h1>
                            <p style={paymentStyles.subtitle}>Welcome, {userData.name}!</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                        <button
                            style={{
                                ...paymentStyles.logoutBtn,
                                marginLeft: 0,
                                color: '#93c5fd',
                                background: 'rgba(59,130,246,0.1)',
                                borderColor: 'rgba(59,130,246,0.25)',
                            }}
                            onClick={handleEdit}
                            onMouseEnter={(e) => handleEditHover(e, true)}
                            onMouseLeave={(e) => handleEditHover(e, false)}
                        >
                            Edit Payment
                        </button>
                        <button
                            style={{ ...paymentStyles.logoutBtn, marginLeft: 0 }}
                            onClick={handleLogout}
                            onMouseEnter={(e) => handleLogoutHover(e, true)}
                            onMouseLeave={(e) => handleLogoutHover(e, false)}
                        >
                            <LogoutIcon /> Logout
                        </button>
                    </div>
                </div>

                {/* Success message if data came from payment portal */}
                {passedPaymentData && (
                    <div style={verificationStyles.successBox}>
                        Payment details received. Confirm to submit for staff approval.
                    </div>
                )}
                {submitError && (
                    <div style={{ ...verificationStyles.successBox, color: '#fca5a5', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' }}>
                        {submitError}
                    </div>
                )}

                {/* Customer Details Section */}
                <div style={verificationStyles.sectionLabel}>Customer Details</div>
                <div style={verificationStyles.rows}>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Holder Name</span>
                        <span style={verificationStyles.rowValue}>{userData.name}</span>
                    </div>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Account Number</span>
                        <span style={verificationStyles.rowValue}>{userData.accountNumber}</span>
                    </div>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Branch Code</span>
                        <span style={verificationStyles.rowValue}>{userData.branchCode}</span>
                    </div>
                    <div style={{ ...verificationStyles.row, ...verificationStyles.rowLast }}>
                        <span style={verificationStyles.rowLabel}>Account Type</span>
                        <span style={verificationStyles.badge}>{userData.accountType}</span>
                    </div>
                </div>

                <hr style={verificationStyles.divider} />

                {/* Payment Details Section */}
                <div style={verificationStyles.sectionLabel}>Payment Details</div>
                <div style={verificationStyles.rows}>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Payment Method</span>
                        <span style={verificationStyles.badge}>{paymentData.paymentMethod}</span>
                    </div>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Receiver IBAN</span>
                        <span style={{ ...verificationStyles.rowValue, fontSize: 11, color: '#94a3b8' }}>
                            {paymentData.receiverIban}
                        </span>
                    </div>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Receiver SWIFT Code</span>
                        <span style={{ ...verificationStyles.rowValue, fontSize: 12 }}>
                            {paymentData.receiverSwiftCode}
                        </span>
                    </div>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Amount</span>
                        <span style={verificationStyles.amountValue}>
                            {formattedAmount}
                        </span>
                    </div>
                    <div style={verificationStyles.row}>
                        <span style={verificationStyles.rowLabel}>Currency</span>
                        <span style={verificationStyles.badge}>{paymentData.currency}</span>
                    </div>
                    {paymentData.description && (
                        <div style={{ ...verificationStyles.row, ...verificationStyles.rowLast }}>
                            <span style={verificationStyles.rowLabel}>Description</span>
                            <span style={verificationStyles.rowValue}>{paymentData.description}</span>
                        </div>
                    )}
                </div>

                {/* Confirm Button */}
                <button
                    style={{
                        ...paymentStyles.btn,
                        marginTop: 24,
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleConfirm}
                    onMouseEnter={(e) => !isSubmitting && handleButtonHover(e, true)}
                    onMouseLeave={(e) => !isSubmitting && handleButtonHover(e, false)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit for Approval'}
                </button>

                {/* Notice */}
                <div style={verificationStyles.notice}>
                    <div style={verificationStyles.noticeDot}></div>
                    <span style={verificationStyles.noticeText}>Please review all details before confirming</span>
                </div>
            </div>

            {submittedTransactionId && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="payment-submitted-title"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 20,
                        display: 'grid',
                        placeItems: 'center',
                        padding: 20,
                        background: 'rgba(2, 6, 23, 0.82)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: 430,
                            padding: '30px 28px',
                            borderRadius: 20,
                            background: 'linear-gradient(145deg, rgba(15,35,65,0.98), rgba(5,16,35,0.98))',
                            border: '1px solid rgba(96,165,250,0.25)',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: 58,
                                height: 58,
                                margin: '0 auto 18px',
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                color: '#86efac',
                                background: 'rgba(34,197,94,0.12)',
                                border: '1px solid rgba(34,197,94,0.35)',
                                fontSize: 28,
                                fontWeight: 800,
                            }}
                        >
                            ✓
                        </div>
                        <h2 id="payment-submitted-title" style={{ margin: '0 0 10px', color: '#e2e8f0', fontSize: 23 }}>
                            Payment Submitted
                        </h2>
                        <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
                            Your payment has been sent to staff for verification.
                        </p>
                        <div
                            style={{
                                margin: '18px 0 22px',
                                padding: '11px 14px',
                                borderRadius: 10,
                                color: '#93c5fd',
                                background: 'rgba(37,99,235,0.12)',
                                border: '1px solid rgba(59,130,246,0.25)',
                                fontSize: 12,
                                fontWeight: 700,
                                overflowWrap: 'anywhere',
                            }}
                        >
                            Transaction ID: {submittedTransactionId}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/portal')}
                            style={{ ...paymentStyles.btn, marginTop: 0 }}
                            onMouseEnter={(e) => handleButtonHover(e, true)}
                            onMouseLeave={(e) => handleButtonHover(e, false)}
                        >
                            Return to Payment Portal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationPage;
