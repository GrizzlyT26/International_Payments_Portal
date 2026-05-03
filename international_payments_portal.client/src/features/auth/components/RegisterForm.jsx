/**
 * RegisterForm component
 * Handles user registration form UI and logic
 */

import { useState } from 'react';
import { UserIcon, MailIcon, LockIcon, GlobeIcon } from '../../../shared/components/icons';
import { authStyles, handleInputFocus, handleInputBlur } from '../styles/authStyles';
import { useAuth } from '../hooks/useAuth';

export const RegisterForm = () => {
    const { register, loading, error } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register({ fullName, email, password });
    };

    return (
        <div style={authStyles.page}>
            {/* Animated background orbs */}
            <div style={authStyles.orb(500, "-18%", "-14%", "0s", "rgba(37,99,235,0.14)")} />
            <div style={authStyles.orb(320, "55%", "65%", "2s", "rgba(14,165,233,0.09)")} />
            <div style={authStyles.orb(260, "10%", "72%", "4s", "rgba(99,102,241,0.08)")} />

            <div style={authStyles.cardWide}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <GlobeIcon />
                    <h2 style={authStyles.title}>Create Account</h2>
                </div>
                <p style={authStyles.subtitle}>Join us for secure international payments</p>

                {/* Error message */}
                {error && <div style={authStyles.errBox}>{error}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    {/* Full Name field */}
                    <label style={authStyles.label}>Full Name</label>
                    <div style={authStyles.inputWrap}>
                        <div style={authStyles.iconSlot}>
                            <UserIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            style={authStyles.input}
                            required
                        />
                    </div>

                    {/* Email field */}
                    <label style={authStyles.label}>Email Address</label>
                    <div style={authStyles.inputWrap}>
                        <div style={authStyles.iconSlot}>
                            <MailIcon />
                        </div>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            style={authStyles.input}
                            required
                        />
                    </div>

                    {/* Password field */}
                    <label style={authStyles.label}>Password</label>
                    <div style={authStyles.inputWrap}>
                        <div style={authStyles.iconSlot}>
                            <LockIcon />
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            style={authStyles.input}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...authStyles.btn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Footer link */}
                <p style={authStyles.footer}>
                    Already have an account?{' '}
                    <a href="/login" style={authStyles.link}>
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
