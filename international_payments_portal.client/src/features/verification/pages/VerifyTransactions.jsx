import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../shared/utils/apiClient';
import { storage } from '../../../shared/utils/localStorage';

const colors = {
    background: 'linear-gradient(135deg, #020818 0%, #0a1628 55%, #0d2045 100%)',
    panel: 'linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))',
    border: '1px solid rgba(99,179,237,0.14)',
    text: '#e2e8f0',
    muted: '#94a3b8',
    blue: '#3b82f6',
};

const normalizeStatus = (status) => {
    if (status?.toLowerCase() === 'completed') return 'Approved';
    if (!status) return 'Pending';
    return `${status.charAt(0).toUpperCase()}${status.slice(1).toLowerCase()}`;
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? 'N/A'
        : date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: '2-digit' });
};

const formatDateTime = (value) => {
    if (!value) return 'Not reviewed';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? 'Not reviewed'
        : date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
};

const formatAmount = (transaction) => {
    const amount = Number(transaction.amount || 0);
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: transaction.currency || 'USD',
    }).format(amount);
};

const statusStyle = (status) => {
    const styles = {
        Pending: { color: '#fbbf24', background: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.28)' },
        Approved: { color: '#86efac', background: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.28)' },
        Rejected: { color: '#fca5a5', background: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.28)' },
    };
    return styles[status] || styles.Pending;
};

const buttonStyle = (variant = 'primary') => {
    const variants = {
        primary: { background: 'linear-gradient(90deg, #2563eb, #3b82f6)', color: '#fff', border: 'none' },
        secondary: { background: 'rgba(255,255,255,0.05)', color: colors.text, border: '1px solid rgba(148,163,184,0.25)' },
        danger: { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)' },
        success: { background: 'rgba(34,197,94,0.18)', color: '#86efac', border: '1px solid rgba(34,197,94,0.38)' },
    };

    return {
        ...variants[variant],
        borderRadius: 10,
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
    };
};

const inputStyle = {
    width: '100%',
    minHeight: 42,
    padding: '10px 12px',
    borderRadius: 9,
    border: '1px solid rgba(99,179,237,0.18)',
    background: 'rgba(2,8,24,0.55)',
    color: colors.text,
    outline: 'none',
};

const VerifyTransactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [requestedAction, setRequestedAction] = useState(null);
    const staffUser = storage.getUser();
    const reviewer = staffUser?.email || staffUser?.Email || 'Staff Member';

    const fetchTransactions = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/Payment/transactions');
            const data = response.data?.data || [];
            setTransactions(data.map((transaction) => ({
                ...transaction,
                status: normalizeStatus(transaction.status),
            })));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to load transactions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const stats = useMemo(() => ({
        total: transactions.length,
        pending: transactions.filter((item) => item.status === 'Pending').length,
        approved: transactions.filter((item) => item.status === 'Approved').length,
        rejected: transactions.filter((item) => item.status === 'Rejected').length,
    }), [transactions]);

    const filteredTransactions = useMemo(() => {
        const term = search.trim().toLowerCase();

        return transactions.filter((transaction) => {
            const transactionDate = transaction.transactionDate
                ? new Date(transaction.transactionDate)
                : null;
            const matchesSearch = !term || [
                transaction.transactionId,
                transaction.accountHolder,
                transaction.receiverIBAN,
                transaction.amount,
                transaction.currency,
            ].some((value) => String(value || '').toLowerCase().includes(term));
            const matchesStatus = statusFilter === 'All' || transaction.status === statusFilter;
            const matchesStart = !startDate || (transactionDate && transactionDate >= new Date(`${startDate}T00:00:00`));
            const matchesEnd = !endDate || (transactionDate && transactionDate <= new Date(`${endDate}T23:59:59`));

            return matchesSearch && matchesStatus && matchesStart && matchesEnd;
        });
    }, [transactions, search, statusFilter, startDate, endDate]);

    const updateStatus = async (status) => {
        if (!selectedTransaction) return;
        const notes = reviewNotes.trim();

        if (status === 'Rejected' && !notes) {
            setReviewError('Please provide a reason before rejecting this transaction.');
            return;
        }

        setUpdating(true);
        setError('');
        setReviewError('');
        setSuccessMessage('');
        try {
            const response = await apiClient.put(`/Payment/transactions/${selectedTransaction.id}/status`, {
                status,
                reviewedBy: reviewer,
                reviewNotes: notes,
            });
            const review = response.data?.data || {};
            setTransactions((current) => current.map((transaction) => (
                transaction.id === selectedTransaction.id
                    ? {
                        ...transaction,
                        status,
                        reviewedAt: review.reviewedAt,
                        reviewedBy: review.reviewedBy,
                        reviewNotes: review.reviewNotes,
                    }
                    : transaction
            )));
            setSuccessMessage(
                `${selectedTransaction.transactionId || `PAY-${selectedTransaction.id}`} was ${status.toLowerCase()} successfully.`
            );
            setSelectedTransaction(null);
            setReviewNotes('');
            setRequestedAction(null);
        } catch (requestError) {
            setReviewError(requestError.response?.data?.message || `Unable to ${status.toLowerCase()} transaction.`);
        } finally {
            setUpdating(false);
        }
    };

    const openTransaction = (transaction, action = null) => {
        setSelectedTransaction(transaction);
        setReviewNotes(transaction.reviewNotes || '');
        setReviewError('');
        setRequestedAction(action);
    };

    const closeTransaction = () => {
        if (updating) return;
        setSelectedTransaction(null);
        setReviewNotes('');
        setReviewError('');
        setRequestedAction(null);
    };

    const statCards = [
        { label: 'Total Transactions', value: stats.total, color: '#60a5fa' },
        { label: 'Pending', value: stats.pending, color: '#fbbf24' },
        { label: 'Approved', value: stats.approved, color: '#86efac' },
        { label: 'Rejected', value: stats.rejected, color: '#fca5a5' },
    ];

    return (
        <main style={{ minHeight: '100vh', padding: '36px 18px 60px', background: colors.background, fontFamily: "'Inter', system-ui, sans-serif", color: colors.text }}>
            <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 26 }}>
                    <div>
                        <p style={{ margin: '0 0 7px', color: '#60a5fa', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Staff Operations</p>
                        <h1 style={{ margin: 0, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.04em' }}>Transaction Verification</h1>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => navigate('/staff-dashboard')} style={buttonStyle('secondary')}>
                            &larr; Staff Dashboard
                        </button>
                        <button type="button" onClick={fetchTransactions} disabled={loading} style={buttonStyle('primary')}>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
                    {statCards.map((stat) => (
                        <article key={stat.label} style={{ padding: '20px', borderRadius: 16, background: colors.panel, border: colors.border, boxShadow: '0 18px 40px rgba(0,0,0,0.2)' }}>
                            <span style={{ color: colors.muted, fontSize: 13 }}>{stat.label}</span>
                            <strong style={{ display: 'block', marginTop: 10, color: stat.color, fontSize: 30 }}>{stat.value}</strong>
                        </article>
                    ))}
                </section>

                <section style={{ padding: 18, marginBottom: 20, borderRadius: 16, background: colors.panel, border: colors.border }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 2fr) repeat(3, minmax(150px, 1fr))', gap: 12 }}>
                        <label style={{ color: colors.muted, fontSize: 12 }}>
                            Search
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Transaction ID or customer" style={{ ...inputStyle, marginTop: 6 }} />
                        </label>
                        <label style={{ color: colors.muted, fontSize: 12 }}>
                            Status
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
                                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => <option key={status}>{status}</option>)}
                            </select>
                        </label>
                        <label style={{ color: colors.muted, fontSize: 12 }}>
                            Start Date
                            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
                        </label>
                        <label style={{ color: colors.muted, fontSize: 12 }}>
                            End Date
                            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
                        </label>
                    </div>
                </section>

                {error && (
                    <div role="alert" style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 10, color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div role="status" style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 10, color: '#86efac', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                        {successMessage}
                    </div>
                )}

                <section style={{ overflowX: 'auto', borderRadius: 16, background: colors.panel, border: colors.border }}>
                    {loading ? (
                        <p style={{ padding: 36, textAlign: 'center', color: colors.muted }}>Loading transactions...</p>
                    ) : (
                        <table style={{ width: '100%', minWidth: 850, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(2,8,24,0.45)' }}>
                                    {['Transaction ID', 'Date', 'Customer', 'Amount', 'Status', 'Action'].map((heading) => (
                                        <th key={heading} style={{ padding: '14px 16px', color: colors.muted, fontSize: 11, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => {
                                    const badge = statusStyle(transaction.status);
                                    return (
                                        <tr key={transaction.id} style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                                            <td style={{ padding: '15px 16px', fontWeight: 700, color: '#bfdbfe' }}>{transaction.transactionId || `PAY-${transaction.id}`}</td>
                                            <td style={{ padding: '15px 16px', color: colors.muted }}>{formatDate(transaction.transactionDate)}</td>
                                            <td style={{ padding: '15px 16px' }}>{transaction.accountHolder || 'Unknown customer'}</td>
                                            <td style={{ padding: '15px 16px', fontWeight: 700 }}>{formatAmount(transaction)}</td>
                                            <td style={{ padding: '15px 16px' }}>
                                                <span style={{ display: 'inline-block', padding: '5px 9px', borderRadius: 999, fontSize: 11, fontWeight: 800, color: badge.color, background: badge.background, border: `1px solid ${badge.border}` }}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px 16px' }}>
                                                {transaction.status === 'Pending' ? (
                                                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                                                        <button type="button" onClick={() => openTransaction(transaction)} style={buttonStyle('secondary')}>Details</button>
                                                        <button type="button" onClick={() => openTransaction(transaction, 'Rejected')} style={buttonStyle('danger')}>Reject</button>
                                                        <button type="button" onClick={() => openTransaction(transaction, 'Approved')} style={buttonStyle('success')}>Approve</button>
                                                    </div>
                                                ) : (
                                                    <button type="button" onClick={() => openTransaction(transaction)} style={buttonStyle('secondary')}>View</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    {!loading && filteredTransactions.length === 0 && (
                        <p style={{ padding: 34, textAlign: 'center', color: colors.muted }}>No transactions match these filters.</p>
                    )}
                </section>
            </div>

            {selectedTransaction && (
                <div role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title" onClick={closeTransaction} style={{ position: 'fixed', inset: 0, zIndex: 20, display: 'grid', placeItems: 'center', padding: 18, background: 'rgba(2,6,23,0.82)', backdropFilter: 'blur(8px)' }}>
                    <section onClick={(event) => event.stopPropagation()} style={{ width: '100%', maxWidth: 560, padding: 26, borderRadius: 18, background: '#0b172b', border: colors.border, boxShadow: '0 30px 80px rgba(0,0,0,0.55)' }}>
                        <p style={{ margin: '0 0 6px', color: '#60a5fa', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Review Transaction</p>
                        <h2 id="transaction-modal-title" style={{ margin: '0 0 22px' }}>{selectedTransaction.transactionId || `PAY-${selectedTransaction.id}`}</h2>
                        {requestedAction && selectedTransaction.status === 'Pending' && (
                            <div style={{
                                marginBottom: 16,
                                padding: '10px 12px',
                                borderRadius: 9,
                                color: requestedAction === 'Approved' ? '#86efac' : '#fca5a5',
                                background: requestedAction === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: requestedAction === 'Approved' ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)',
                                fontSize: 13,
                            }}>
                                Confirm that you want to {requestedAction.toLowerCase()} this transaction.
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                            {[
                                ['Customer', selectedTransaction.accountHolder || 'Unknown customer'],
                                ['Date', formatDate(selectedTransaction.transactionDate)],
                                ['Amount', formatAmount(selectedTransaction)],
                                ['Fee', formatAmount({ amount: selectedTransaction.fee, currency: selectedTransaction.currency })],
                                ['Receiver IBAN', selectedTransaction.receiverIBAN || 'N/A'],
                                ['Receiver SWIFT', selectedTransaction.receiverSWIFT || 'N/A'],
                                ['Description', selectedTransaction.description || 'No description'],
                                ['Status', selectedTransaction.status],
                                ['Reviewed By', selectedTransaction.reviewedBy || 'Not reviewed'],
                                ['Reviewed At', formatDateTime(selectedTransaction.reviewedAt)],
                            ].map(([label, value]) => (
                                <div key={label} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.035)', overflowWrap: 'anywhere' }}>
                                    <span style={{ display: 'block', marginBottom: 5, color: colors.muted, fontSize: 11, textTransform: 'uppercase' }}>{label}</span>
                                    <strong style={{ fontSize: 13 }}>{value}</strong>
                                </div>
                            ))}
                        </div>
                        <label style={{ display: 'block', marginTop: 18, color: colors.muted, fontSize: 12 }}>
                            {selectedTransaction.status === 'Pending' ? 'Review Notes / Rejection Reason' : 'Review Notes'}
                            <textarea
                                value={reviewNotes}
                                onChange={(event) => {
                                    setReviewNotes(event.target.value);
                                    setReviewError('');
                                }}
                                disabled={selectedTransaction.status !== 'Pending' || updating}
                                maxLength={500}
                                placeholder="Required when rejecting; optional when approving"
                                style={{ ...inputStyle, minHeight: 90, marginTop: 6, resize: 'vertical' }}
                            />
                        </label>
                        {reviewError && <p style={{ margin: '8px 0 0', color: '#fca5a5', fontSize: 12 }}>{reviewError}</p>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                            <button type="button" disabled={updating} onClick={closeTransaction} style={buttonStyle('secondary')}>Cancel</button>
                            {selectedTransaction.status === 'Pending' && (
                                <>
                                    {requestedAction !== 'Approved' && (
                                        <button type="button" disabled={updating} onClick={() => updateStatus('Rejected')} style={buttonStyle('danger')}>{updating ? 'Updating...' : 'Reject Transaction'}</button>
                                    )}
                                    {requestedAction !== 'Rejected' && (
                                        <button type="button" disabled={updating} onClick={() => updateStatus('Approved')} style={buttonStyle('success')}>{updating ? 'Updating...' : 'Approve Transaction'}</button>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            )}

            <style>{`
                @media (max-width: 800px) {
                    main section > div[style*="grid-template-columns: minmax(220px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </main>
    );
};

export default VerifyTransactions;
