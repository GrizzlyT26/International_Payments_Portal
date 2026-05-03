/**
 * Verification page styles
 * Follows the same pattern as paymentStyles
 */

export const verificationStyles = {
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
        animation: "fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
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
        background: "linear-gradient(90deg,#1e40af,#2563eb,#38bdf8,#2563eb,#1e40af)",
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
};

// Keyframes as CSS strings (to be injected globally)
export const keyframes = `
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

// Hover handlers
export const handleLogoutHover = (e, isEnter) => {
    if (isEnter) {
        e.target.style.background = "rgba(239,68,68,0.25)";
    } else {
        e.target.style.background = "rgba(239,68,68,0.15)";
    }
};

export const handleButtonHover = (e, isEnter) => {
    if (isEnter) {
        e.target.style.transform = "translateY(-1px)";
        e.target.style.boxShadow = "0 6px 28px rgba(37,99,235,0.5)";
    } else {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 20px rgba(37,99,235,0.4)";
    }
};