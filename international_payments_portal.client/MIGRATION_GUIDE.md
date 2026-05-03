# Migration Guide: Old vs New Structure

This document shows the differences between the old flat structure and the new feature-based structure.

## File Location Changes

### Authentication Files

| Feature | Old Location | New Location |
|---------|-------------|--------------|
| Login Page | `src/Login.jsx` | `src/features/auth/pages/Login.jsx` |
| Register Page | `src/Register.jsx` | `src/features/auth/pages/Register.jsx` |
| Extracted Components | N/A | `src/features/auth/components/LoginForm.jsx` |
| | | `src/features/auth/components/RegisterForm.jsx` |
| Services | Inline in components | `src/features/auth/services/authService.js` |
| Custom Hook | N/A | `src/features/auth/hooks/useAuth.js` |
| Styles | Inline in components | `src/features/auth/styles/authStyles.js` |
| Constants | N/A | `src/features/auth/constants/authConstants.js` |

### Payments Files

| Feature | Old Location | New Location |
|---------|-------------|--------------|
| Payment Portal | `src/PaymentPortal.jsx` | `src/features/payments/pages/PaymentPortal.jsx` |
| Payment Form | `src/components/PaymentForm.jsx` | `src/features/payments/components/PaymentForm.jsx` |
| Services | `src/services/api.js` | `src/features/payments/services/paymentService.js` |
| Custom Hook | N/A | `src/features/payments/hooks/usePayment.js` |
| Styles | Inline in components | `src/features/payments/styles/paymentStyles.js` |
| Constants | Inline in components | `src/features/payments/constants/paymentConstants.js` |
| Validation | Inline in components | `src/features/payments/validation/paymentValidation.js` |

### Shared Resources

| Resource | Old Location | New Location |
|----------|-------------|--------------|
| Icons | Inline in components | `src/shared/components/icons/*.jsx` |
| API Client | `src/services/api.js` | `src/shared/utils/apiClient.js` |
| Global Styles | `src/index.css` | `src/shared/styles/globals.css` |

## Import Changes

### Before (Old Structure)
```javascript
import Register from "./Register";
import Login from "./Login";
import PaymentPortal from "./PaymentPortal";
import { paymentAPI } from "./services/api";
import PaymentForm from "./components/PaymentForm";

// Using inline logic
const handleLogin = async () => {
    const res = await axios.post("https://localhost:5001/api/auth/login", {...});
};
```

### After (New Structure)
```javascript
// Option 1: Direct imports
import { Register, Login, PaymentPortal } from "./features";
import { useAuth } from "./features/auth";
import { usePayment } from "./features/payments";
import { PaymentForm } from "./features/payments/components";

// Option 2: Feature-specific imports
import { Login, Register } from "./features/auth/pages";
import { PaymentPortal } from "./features/payments/pages";
import { useAuth } from "./features/auth/hooks/useAuth";

// Using custom hooks and services
const { login, loading, error } = useAuth();
await login({ email, password });
```

## Component Refactoring Examples

### Login Component

**Before:**
```javascript
// src/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MailIcon = () => (/* SVG */);
const LockIcon = () => (/* SVG */);
const GlobeIcon = () => (/* SVG */);

const S = { /* All styles inline */ };

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        // All logic here
    };

    return (/* JSX with inline styles */);
}
```

**After:**
```javascript
// src/features/auth/pages/Login.jsx
import { LoginForm } from '../components';

export const Login = () => {
    return <LoginForm />;
};

// src/features/auth/components/LoginForm.jsx
import { useState } from 'react';
import { MailIcon, LockIcon, GlobeIcon } from '../../../shared/components/icons';
import { authStyles, handleInputFocus, handleInputBlur } from '../styles/authStyles';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password });
    };

    return (/* JSX */);
};
```

### Payment Portal

**Before:**
```javascript
// src/PaymentPortal.jsx
import { useState } from "react";
import { paymentAPI } from "./services/api";

const CURRENCIES = [/* hardcoded */];
const PROVIDERS = [/* hardcoded */];

// Validation functions
const validateIBAN = v => /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/i.test(v);
const validateSWIFT = v => /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(v);

const S = { /* All styles inline */ };

function PaymentPortal() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        // Validation and API call
    };

    return (/* JSX */);
}
```

**After:**
```javascript
// src/features/payments/pages/PaymentPortal.jsx
import { GlobeIcon, LogoutIcon } from '../../../shared/components/icons';
import { paymentStyles } from '../styles/paymentStyles';
import { PaymentForm } from '../components';
import { useAuth } from '../../auth/hooks/useAuth';

export const PaymentPortal = () => {
    const { logout } = useAuth();
    
    return (
        <div style={paymentStyles.page}>
            {/* Orbs and header */}
            <div style={paymentStyles.card}>
                <div style={paymentStyles.header}>
                    {/* Header content */}
                    <button onClick={logout}>Logout</button>
                </div>
                <PaymentForm />
            </div>
        </div>
    );
};

// src/features/payments/components/PaymentForm.jsx
import { usePayment } from '../hooks/usePayment';
import { validatePaymentForm } from '../validation/paymentValidation';
import { CURRENCIES, PAYMENT_PROVIDERS } from '../constants/paymentConstants';

export const PaymentForm = () => {
    const { processPayment, loading, error } = usePayment();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validatePaymentForm(formData);
        if (errors.length === 0) {
            await processPayment(formData);
        }
    };

    return (/* JSX */);
};
```

## API Service Changes

### Before
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

// Token interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/Auth/register', data),
    login: (data) => api.post('/Auth/login', data)
};

export const paymentAPI = {
    processPayment: (data) => api.post('/Payment/process', data)
};
```

### After
```javascript
// src/shared/utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://localhost:5001/api',
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// src/features/auth/services/authService.js
import apiClient from '../../../shared/utils/apiClient';

export const authService = {
    register: async (data) => {
        const response = await apiClient.post('/Auth/register', {...});
        return response.data;
    },
    login: async (credentials) => {
        const response = await apiClient.post('/Auth/login', {...});
        return response.data;
    }
};

// src/features/payments/services/paymentService.js
import apiClient from '../../../shared/utils/apiClient';

export const paymentService = {
    processPayment: async (data) => {
        const response = await apiClient.post('/Payment/process', {...});
        return response.data;
    }
};
```

## Custom Hooks (New)

### useAuth Hook
```javascript
// src/features/auth/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = useCallback(async (credentials) => {
        setLoading(true);
        try {
            const result = await authService.login(credentials);
            localStorage.setItem('authToken', result.token);
            navigate('/portal');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { loading, error, login };
};
```

### usePayment Hook
```javascript
// src/features/payments/hooks/usePayment.js
import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const processPayment = useCallback(async (paymentData) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const result = await paymentService.processPayment(paymentData);
            setSuccess('Payment processed successfully!');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, success, processPayment };
};
```

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Organization** | Flat file structure | Feature-based hierarchy |
| **Reusability** | Icons duplicated in files | Centralized icons folder |
| **Styles** | Inline in components | Extracted to style files |
| **Validation** | Inline in components | Dedicated validation module |
| **Logic** | Mixed in components | Extracted to custom hooks |
| **API Calls** | Axios calls in components | Service layer with centralized client |
| **Constants** | Hardcoded in files | Centralized constants |
| **Testing** | Difficult to test | Easy to test (isolated services) |
| **Scalability** | Hard to add features | Easy to add new features |
| **Maintenance** | Harder to find code | Easier navigation |

## Migration Checklist

- [x] Create new feature-based directory structure
- [x] Extract all icons to shared components
- [x] Create auth service and useAuth hook
- [x] Create payment service and usePayment hook
- [x] Extract styles to dedicated files
- [x] Extract validation functions
- [x] Extract constants
- [x] Create barrel exports for cleaner imports
- [x] Update App.jsx with new imports
- [x] Update global styles
- [x] Create documentation

## Next Steps

1. **Delete old files** (after verifying everything works):
   - `src/Login.jsx`
   - `src/Register.jsx`
   - `src/PaymentPortal.jsx`
   - `src/components/PaymentForm.jsx`
   - `src/components/` (if empty)
   - `src/services/api.js`
   - `src/services/` (if empty)

2. **Test all routes**:
   - Visit `http://localhost:5173/` (Register)
   - Visit `http://localhost:5173/login` (Login)
   - Visit `http://localhost:5173/portal` (Payment Portal)

3. **Add to version control**:
   ```bash
   git add .
   git commit -m "refactor: restructure project to feature-based architecture"
   ```

4. **Future enhancements**:
   - Add more features following the same pattern
   - Implement Context API for global auth state
   - Add more shared UI components
   - Implement testing suite
