import { useNavigate } from 'react-router-dom';
import { GlobeIcon } from '../../../shared/components/icons';
import { useStorageUser } from '../../../shared/hooks';
import RecentTransactions from '../components/RecentTransactions';
import { paymentStyles } from '../styles/paymentStyles';

export const CustomerTransactions = () => {
    const navigate = useNavigate();
    const user = useStorageUser();

    return (
        <div style={paymentStyles.page}>
            <div style={paymentStyles.orb(500, '-18%', '-14%', '0s', 'rgba(37,99,235,0.14)')} />
            <div style={paymentStyles.orb(320, '55%', '65%', '2s', 'rgba(14,165,233,0.09)')} />
            <div style={paymentStyles.orb(260, '10%', '72%', '4s', 'rgba(99,102,241,0.08)')} />

            <div style={paymentStyles.card}>
                <div style={paymentStyles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <GlobeIcon size={32} />
                        <div>
                            <h1 style={paymentStyles.title}>My Transactions</h1>
                            <p style={paymentStyles.subtitle}>
                                Welcome, {user?.fullName || user?.FullName || 'Customer'}!
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/portal')}
                        style={{
                            ...paymentStyles.logoutBtn,
                            marginLeft: 'auto',
                            color: '#93c5fd',
                            background: 'rgba(59,130,246,0.1)',
                            borderColor: 'rgba(59,130,246,0.25)',
                        }}
                    >
                        Back to Payment Portal
                    </button>
                </div>

                <RecentTransactions userId={user?.id ?? user?.Id} />
            </div>
        </div>
    );
};

export default CustomerTransactions;
