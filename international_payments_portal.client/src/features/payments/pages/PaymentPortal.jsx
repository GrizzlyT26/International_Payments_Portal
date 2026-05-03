/**
 * PaymentPortal page
 * Main payment portal with header and form
 */

import { useNavigate } from 'react-router-dom';
import { GlobeIcon, LogoutIcon } from '../../../shared/components/icons';
import { paymentStyles } from '../styles/paymentStyles';
import { PaymentForm } from '../components';
import { useAuth } from '../../auth/hooks/useAuth';
import { useStorageUser } from '../../../shared/hooks';

export const PaymentPortal = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const user = useStorageUser();

    // Store user data in localStorage for verification page access
    if (user && user.fullName) {
        localStorage.setItem('userName', user.fullName);
        localStorage.setItem('accountNumber', user.accountNumber || '•••• •••• 4821');
        localStorage.setItem('branchCode', user.branchCode || '632005');
        localStorage.setItem('accountType', user.accountType || 'Cheque');
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={paymentStyles.page}>
            {/* Animated background orbs */}
            <div style={paymentStyles.orb(500, "-18%", "-14%", "0s", "rgba(37,99,235,0.14)")} />
            <div style={paymentStyles.orb(320, "55%", "65%", "2s", "rgba(14,165,233,0.09)")} />
            <div style={paymentStyles.orb(260, "10%", "72%", "4s", "rgba(99,102,241,0.08)")} />

            <div style={paymentStyles.card}>
                {/* Header */}
                <div style={paymentStyles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <GlobeIcon size={32} />
                        <div>
                            <h1 style={paymentStyles.title}>Payment Portal</h1>
                            <p style={paymentStyles.subtitle}>
                                Welcome, {user?.fullName || 'User'}!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={paymentStyles.logoutBtn}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(239,68,68,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239,68,68,0.1)';
                        }}
                    >
                        <LogoutIcon /> Logout

                    </button>
                </div>

                {/* Payment Form */}
                <PaymentForm />
            </div>
        </div>
    );
};

export default PaymentPortal;