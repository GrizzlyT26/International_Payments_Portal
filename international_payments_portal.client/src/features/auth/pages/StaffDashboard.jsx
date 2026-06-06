/**
 * Staff dashboard page
 * Provides a landing page for staff members after login
 */

import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../../../shared/utils/localStorage';
import { authStyles } from '../styles/authStyles';
import apiClient from '../../../shared/utils/apiClient';

export const StaffDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const user = storage.getUser();
    const [showTransactions, setShowTransactions] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        activeCount: 0,
        totalAmount: 0,
        pendingCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const welcomeName = useMemo(() => {
        return user?.fullName || user?.FullName || 'Staff Member';
    }, [user]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await apiClient.get('/Payment/transactions');
                if (response.data?.success && response.data?.data) {
                    const txns = response.data.data;
                    setTransactions(txns);

                    // Calculate stats
                    const activeCount = txns.length;
                    const totalAmount = txns.reduce((sum, txn) => sum + (txn.amount || 0), 0);
                    const pendingCount = txns.filter(txn => txn.status === 'Pending').length;

                    setStats({
                        activeCount,
                        totalAmount: totalAmount.toFixed(2),
                        pendingCount,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                setError(error.message || 'Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const statsDisplay = [
        { label: 'Active Transactions', value: stats.activeCount.toString() },
        { label: 'Total Amount', value: `$${parseFloat(stats.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { label: 'Pending Reviews', value: stats.pendingCount.toString() },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '40px 16px 60px',
            background: 'linear-gradient(135deg, #020818 0%, #0a1628 55%, #0d2045 100%)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            <div style={authStyles.orb(500, '-18%', '-14%', '0s', 'rgba(37,99,235,0.14)')} />
            <div style={authStyles.orb(320, '55%', '65%', '2s', 'rgba(14,165,233,0.09)')} />
            <div style={authStyles.orb(260, '10%', '72%', '4s', 'rgba(99,102,241,0.08)')} />

            <div style={{
                ...authStyles.cardWide,
                width: '100%',
                maxWidth: 960,
                padding: '32px 40px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{ margin: 0, ...authStyles.title, color: '#e2e8f0' }}>Staff Dashboard</h1>
                        <p style={{ margin: '10px 0 0', color: '#94a3b8', fontSize: 14, maxWidth: 560 }}>
                            Welcome back, {welcomeName}. Manage customer support and payment operations from here.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={logout}
                        style={authStyles.primaryBtn}
                    >
                        Sign Out
                    </button>
                </header>

                <section style={authStyles.statsGrid}>
                    {statsDisplay.map((stat) => (
                        <div key={stat.label} style={authStyles.statCard}>
                            <span style={{ color: '#94a3b8', fontSize: 13 }}>{stat.label}</span>
                            <strong style={authStyles.statValue}>{stat.value}</strong>
                        </div>
                    ))}
                </section>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: 18 }}>Recent Transactions</h2>
                        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>
                            Review the most recent transactions and verify payment details.
                        </p>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setShowTransactions(!showTransactions)}
                        style={authStyles.primaryBtn}
                    >
                        {showTransactions ? 'Hide' : 'Show'} Transactions
                    </button>
                </div>

                {showTransactions && (
                    <div style={{ overflowX: 'auto', marginTop: 22 }}>
                        {loading ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Loading transactions...</p>
                        ) : error ? (
                            <p style={{ color: '#fca5a5', textAlign: 'center', padding: '20px' }}>{error}</p>
                        ) : transactions.length > 0 ? (
                            <table style={authStyles.table}>
                                <thead>
                                    <tr style={authStyles.tableRow}>
                                        <th style={authStyles.tableHeader}>Account Holder</th>
                                        <th style={authStyles.tableHeader}>Receiver IBAN</th>
                                        <th style={authStyles.tableHeader}>Amount</th>
                                        <th style={authStyles.tableHeader}>Currency</th>
                                        <th style={authStyles.tableHeader}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} style={authStyles.tableBodyRow}>
                                            <td style={authStyles.tableCell}>{transaction.accountHolder || 'N/A'}</td>
                                            <td style={authStyles.tableCell}>{transaction.receiverIBAN}</td>
                                            <td style={authStyles.tableCell}>${transaction.amount?.toFixed(2) || '0.00'}</td>
                                            <td style={authStyles.tableCell}>{transaction.currency || 'USD'}</td>
                                            <td style={{ ...authStyles.tableCell, color: transaction.status === 'Completed' ? '#86efac' : '#fbbf24' }}>
                                                {transaction.status || 'Pending'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No transactions available</p>
                        )}
                    </div>
                )}

                {/* Staff Verification Button */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 30,
                        paddingTop: 24,
                        borderTop: '1px solid rgba(148,163,184,0.15)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => navigate('/staff-verification')}
                        style={{
                            background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '14px',
                            padding: '14px 40px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minWidth: '260px',
                            boxShadow: '0 8px 20px rgba(37,99,235,0.30)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.40)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.30)';
                        }}
                    >
                        Staff Verification →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
