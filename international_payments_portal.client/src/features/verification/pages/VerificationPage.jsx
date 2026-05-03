import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobeIcon from '../components/GlobeIcon';

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

    const handleLogout = () => {
        navigate('/login');
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);

        // Simulate API call or processing
        setTimeout(() => {
            console.log('Payment confirmed:', paymentData);
            setIsSubmitting(false);
            alert('Payment confirmed successfully!');
            navigate('/portal');
        }, 1500);
    };

    const handleEdit = () => {
        // Navigate back to payment portal
        navigate('/portal');
    };

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
        <div style={verificationStyles.page}>
            {/* Animated background orbs */}
            <div style={verificationStyles.orb('500px', '-18%', '-14%', '0s')}></div>
            <div style={verificationStyles.orb('320px', '55%', '65%', '2s', 'rgba(14,165,233,0.09)')}></div>
            <div style={verificationStyles.orb('260px', '10%', '72%', '4s', 'rgba(99,102,241,0.08)')}></div>

            <div style={verificationStyles.card}>
                {/* Header */}
                <div style={verificationStyles.header}>
                    <div style={verificationStyles.logoRow}>
                        <GlobeIcon style={verificationStyles.globeIcon} />
                        <h2 style={verificationStyles.title}>Verification Page</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            style={verificationStyles.editBtn}
                            onClick={handleEdit}
                            onMouseEnter={(e) => handleEditHover(e, true)}
                            onMouseLeave={(e) => handleEditHover(e, false)}
                        >
                            Edit Payment
                        </button>
                        <button
                            style={verificationStyles.logoutBtn}
                            onClick={handleLogout}
                            onMouseEnter={(e) => handleLogoutHover(e, true)}
                            onMouseLeave={(e) => handleLogoutHover(e, false)}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Success message if data came from payment portal */}
                {passedPaymentData && (
                    <div style={verificationStyles.successBox}>
                        ✓ Payment details received! Please verify before confirming.
                    </div>
                )}

                {/* Welcome message */}
                <p style={verificationStyles.welcome}>Welcome, {userData.name}</p>

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
                            {paymentData.currency === 'EUR' ? '€' : '$'} {parseFloat(paymentData.amount).toFixed(2)}
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
                        ...verificationStyles.btn,
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleConfirm}
                    onMouseEnter={(e) => !isSubmitting && handleButtonHover(e, true)}
                    onMouseLeave={(e) => !isSubmitting && handleButtonHover(e, false)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Confirm & Submit'}
                </button>

                {/* Notice */}
                <div style={verificationStyles.notice}>
                    <div style={verificationStyles.noticeDot}></div>
                    <span style={verificationStyles.noticeText}>Please review all details before confirming</span>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;