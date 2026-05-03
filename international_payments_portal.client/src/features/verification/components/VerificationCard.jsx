import React from 'react';
import GlobeIcon from './GlobeIcon';

const VerificationCard = ({ userData, paymentData, onLogout, onConfirm }) => {
    return (
        <div className="vp-card">
            <div className="vp-header">
                <div className="vp-logo-row">
                    <GlobeIcon />
                    <h2 className="vp-title">Verification Page</h2>
                </div>
                <button className="vp-logout" onClick={onLogout}>Logout</button>
            </div>

            <p className="vp-welcome">Welcome, {userData.name}</p>

            {/* Customer Details Section */}
            <div className="vp-section-label">Customer Details</div>
            <div className="vp-rows">
                <div className="vp-row">
                    <span className="vp-row-label">Holder Name</span>
                    <span className="vp-row-value">{userData.name}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Account Number</span>
                    <span className="vp-row-value">{userData.accountNumber}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Branch Code</span>
                    <span className="vp-row-value">{userData.branchCode}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Account Type</span>
                    <span className="vp-badge">{userData.accountType}</span>
                </div>
            </div>

            <hr className="vp-divider" />

            {/* Payment Details Section */}
            <div className="vp-section-label">Payment Details</div>
            <div className="vp-rows">
                <div className="vp-row">
                    <span className="vp-row-label">Payment Method</span>
                    <span className="vp-badge">{paymentData.method}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Receiver IBAN</span>
                    <span className="vp-row-value" style={{ fontSize: '11px', color: '#94a3b8' }}>{paymentData.iban}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Receiver Swift Code</span>
                    <span className="vp-row-value" style={{ fontSize: '12px' }}>{paymentData.swiftCode}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Amount</span>
                    <span className="vp-amount-value">$ {paymentData.amount}</span>
                </div>
                <div className="vp-row">
                    <span className="vp-row-label">Currency</span>
                    <span className="vp-badge">{paymentData.currency}</span>
                </div>
            </div>

            <button className="vp-btn" onClick={onConfirm}>Confirm &amp; Submit</button>

            <div className="vp-notice">
                <div className="vp-notice-dot"></div>
                <span className="vp-notice-text">Please review all details before confirming</span>
            </div>
        </div>
    );
};

export default VerificationCard;