import { useEffect, useState } from 'react';
import apiClient from '../../../shared/utils/apiClient';

const normalizeStatus = (status) => {
    if (status?.toLowerCase() === 'completed') return 'Approved';
    if (!status) return 'Pending';
    return `${status.charAt(0).toUpperCase()}${status.slice(1).toLowerCase()}`;
};

const statusStyles = {
    Pending: {
        color: '#fbbf24',
        background: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.3)',
    },
    Approved: {
        color: '#86efac',
        background: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.3)',
    },
    Rejected: {
        color: '#fca5a5',
        background: 'rgba(239,68,68,0.12)',
        border: 'rgba(239,68,68,0.3)',
    },
};

const formatAmount = (transaction) => new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: transaction.currency || 'USD',
}).format(Number(transaction.amount || 0));

const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? 'Unknown date'
        : date.toLocaleDateString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
};

const maskIban = (iban) => {
    if (!iban) return 'No receiver';
    const compact = iban.replace(/\s/g, '');
    return compact.length <= 8
        ? compact
        : `${compact.slice(0, 4)}...${compact.slice(-4)}`;
};

export const RecentTransactions = ({ userId }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTransactions = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.get(`/Payment/transactions/user/${userId}`);
            setTransactions(response.data?.data || []);
        } catch (requestError) {
            if (requestError.response?.status === 404) {
                setError('Recent transactions endpoint is not loaded. Restart the backend server, then refresh this page.');
            } else {
                setError(requestError.response?.data?.message || 'Unable to load recent transactions.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [userId]);

    return (
        <section style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: '1px solid rgba(99,179,237,0.13)',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 14,
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: 18 }}>
                        Recent Transactions
                    </h2>
                    <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12 }}>
                        Track your latest payment approvals.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={loadTransactions}
                    disabled={loading || !userId}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                        padding: '7px 12px',
                        borderRadius: 8,
                        color: '#93c5fd',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                    }}
                >
                    {loading && (
                        <span
                            aria-hidden="true"
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                border: '2px solid rgba(147,197,253,0.3)',
                                borderTopColor: '#93c5fd',
                                animation: 'transactionRefreshSpin 0.75s linear infinite',
                            }}
                        />
                    )}
                    {loading ? 'Fetching...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div style={{
                    padding: '10px 12px',
                    borderRadius: 9,
                    color: '#fca5a5',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    fontSize: 12,
                }}>
                    {error}
                </div>
            )}

            {!userId && !loading && (
                <p style={{ color: '#94a3b8', fontSize: 12 }}>
                    Sign in again to view your transaction history.
                </p>
            )}

            {userId && !loading && !error && transactions.length === 0 && (
                <div style={{
                    padding: '20px 14px',
                    borderRadius: 10,
                    color: '#94a3b8',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(99,179,237,0.1)',
                    textAlign: 'center',
                    fontSize: 13,
                }}>
                    No transactions submitted yet.
                </div>
            )}

            {transactions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {transactions.map((transaction) => {
                        const status = normalizeStatus(transaction.status);
                        const badge = statusStyles[status] || statusStyles.Pending;

                        return (
                            <article
                                key={transaction.id}
                                style={{
                                    padding: '13px 14px',
                                    borderRadius: 11,
                                    background: 'rgba(255,255,255,0.035)',
                                    border: '1px solid rgba(99,179,237,0.11)',
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: 12,
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <strong style={{
                                            display: 'block',
                                            color: '#bfdbfe',
                                            fontSize: 12,
                                            overflowWrap: 'anywhere',
                                        }}>
                                            {transaction.transactionId || `PAY-${transaction.id}`}
                                        </strong>
                                        <span style={{ display: 'block', marginTop: 5, color: '#64748b', fontSize: 11 }}>
                                            {formatDate(transaction.createdAt)} · Receiver {maskIban(transaction.receiverIBAN)}
                                        </span>
                                    </div>
                                    <span style={{
                                        flexShrink: 0,
                                        padding: '4px 8px',
                                        borderRadius: 999,
                                        color: badge.color,
                                        background: badge.background,
                                        border: `1px solid ${badge.border}`,
                                        fontSize: 10,
                                        fontWeight: 800,
                                    }}>
                                        {status}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 12,
                                    marginTop: 10,
                                }}>
                                    <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 800 }}>
                                        {formatAmount(transaction)}
                                    </span>
                                    {status !== 'Rejected' && (
                                        <span style={{ color: '#94a3b8', fontSize: 11 }}>
                                            {transaction.description || 'International payment'}
                                        </span>
                                    )}
                                </div>
                                {status === 'Rejected' && transaction.reviewNotes && (
                                    <div style={{
                                        marginTop: 10,
                                        padding: '8px 10px',
                                        borderRadius: 8,
                                        color: '#fca5a5',
                                        background: 'rgba(239,68,68,0.08)',
                                        fontSize: 11,
                                        lineHeight: 1.5,
                                    }}>
                                        Reason: {transaction.reviewNotes}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
            <style>{`
                @keyframes transactionRefreshSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

export default RecentTransactions;
