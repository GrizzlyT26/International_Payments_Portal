/**
 * LoginForm component
 * Handles user login form UI and logic
 */

import { useState } from 'react';
import { MailIcon, LockIcon, GlobeIcon } from '../../../shared/components/icons';
import { authStyles, handleInputFocus, handleInputBlur } from '../styles/authStyles';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password, role });
    };

    return (
        <div style={authStyles.page}>
            {/* Animated background  */}
            <div style={authStyles.orb(500, "-18%", "-14%", "0s", "rgba(37,99,235,0.14)")} />
            <div style={authStyles.orb(320, "55%", "65%", "2s", "rgba(14,165,233,0.09)")} />
            <div style={authStyles.orb(260, "10%", "72%", "4s", "rgba(99,102,241,0.08)")} />

            <div style={authStyles.card}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <GlobeIcon />
                    <h2 style={authStyles.title}>Login</h2>
                </div>
                <p style={authStyles.subtitle}>Sign in to your account</p>

                {/* Error message */}
                {error && <div style={authStyles.errBox}>{error}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    {/* Role selector */}
                    <label style={authStyles.label}>Login As</label>
                    <div style={authStyles.inputWrap}>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                ...authStyles.input,
                                appearance: 'none',
                                paddingRight: 40,
                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                                backgroundSize: '20px',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                        </select>
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer link */}
                <p style={authStyles.footer}>
                    Don't have an account?{' '}
                    <a href="/" style={authStyles.link}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
