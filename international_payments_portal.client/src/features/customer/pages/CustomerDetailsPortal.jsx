import { GlobeIcon, LogoutIcon } from '../../../shared/components/icons';
import { paymentStyles } from '../../payments/styles/paymentStyles';
import { useAuth } from '../../auth/hooks/useAuth';
import { useStorageUser } from '../../../shared/hooks';
import { CustomerDetailsForm } from '../components';

export const CustomerDetailsPortal = () => {
    const { logout } = useAuth();
    const user = useStorageUser();

    return (
        <div style={paymentStyles.page}>
            <div style={paymentStyles.orb(500, "-18%", "-14%", "0s", "rgba(37,99,235,0.14)")} />

            <div style={paymentStyles.card}>
                <div style={paymentStyles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <GlobeIcon size={32} />
                        <div>
                            <h1 style={paymentStyles.title}>Customer Details</h1>
                            <p style={paymentStyles.subtitle}>
                                Welcome, {user?.fullName || 'User'}!
                            </p>
                        </div>
                    </div>

                    <button onClick={logout} style={paymentStyles.logoutBtn}>
                        <LogoutIcon /> Logout
                    </button>
                </div>

                <CustomerDetailsForm />
            </div>
        </div>
    );
};

export default CustomerDetailsPortal;