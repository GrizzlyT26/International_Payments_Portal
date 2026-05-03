# International Payments Portal - Project Structure

## 📁 Architecture Overview

This project uses a **feature-based folder structure** optimized for scalability and enterprise-level development. Each feature is self-contained with its own components, services, hooks, styles, and constants.

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Reusable auth components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── index.js        # Barrel export
│   │   ├── pages/              # Page-level components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── index.js
│   │   ├── services/           # API services
│   │   │   ├── authService.js
│   │   │   └── index.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useAuth.js
│   │   ├── styles/             # Feature-specific styles
│   │   │   └── authStyles.js
│   │   └── constants/          # Feature constants
│   │       └── authConstants.js
│   │
│   ├── payments/               # Payments feature
│   │   ├── components/
│   │   │   ├── PaymentForm.jsx
│   │   │   └── index.js
│   │   ├── pages/
│   │   │   ├── PaymentPortal.jsx
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── paymentService.js
│   │   │   └── index.js
│   │   ├── hooks/
│   │   │   └── usePayment.js
│   │   ├── styles/
│   │   │   └── paymentStyles.js
│   │   ├── constants/
│   │   │   └── paymentConstants.js
│   │   └── validation/
│   │       └── paymentValidation.js
│   │
│   └── (future features: dashboard, reports, etc.)
│
├── shared/                      # Shared across features
│   ├── components/
│   │   ├── icons/              # SVG icon components
│   │   │   ├── MailIcon.jsx
│   │   │   ├── LockIcon.jsx
│   │   │   ├── GlobeIcon.jsx
│   │   │   ├── UserIcon.jsx
│   │   │   ├── BankIcon.jsx
│   │   │   ├── SwiftIcon.jsx
│   │   │   ├── AmountIcon.jsx
│   │   │   ├── NoteIcon.jsx
│   │   │   ├── LogoutIcon.jsx
│   │   │   └── index.js
│   │   ├── ui/                 # Reusable UI components
│   │   │   └── (future: Button, Card, Modal, etc.)
│   │   └── layout/             # Layout components
│   │       └── (future: Header, Footer, etc.)
│   ├── hooks/                  # Shared custom hooks
│   │   └── (future: useAuth context, useAPI, etc.)
│   ├── utils/                  # Utility functions
│   │   ├── apiClient.js        # Global axios instance
│   │   ├── localStorage.js     # LocalStorage helpers
│   │   └── index.js
│   ├── styles/                 # Global styles
│   │   ├── globals.css         # Global animations & resets
│   │   └── theme.js            # (future: design tokens)
│   └── constants/              # Global constants
│       ├── api.js              # API endpoints
│       └── config.js           # App configuration
│
├── App.jsx                      # Main routing component
├── main.jsx                     # Entry point
├── index.css                    # Global CSS
└── assets/                      # Static assets
    └── (images, fonts, etc.)
```

## 🎯 Key Features of This Structure

### 1. **Feature-Based Organization**
- **Cohesion**: Each feature contains all its dependencies (components, services, hooks, styles)
- **Scalability**: New features can be added without affecting existing code
- **Team Collaboration**: Teams can work on different features independently
- **Easy Testing**: Each feature can be tested in isolation

### 2. **Shared Resources**
- **Icons**: Centralized SVG components for consistent iconography
- **Utils**: Global utilities like `apiClient` and `localStorage` helpers
- **API Client**: Axios instance with interceptors for auth and error handling
- **Global Styles**: Animations and base styles for the entire app

### 3. **Service Layer**
- **authService**: Handles login/register API calls
- **paymentService**: Handles payment processing API calls
- Services are decoupled from components for easier testing and reusability

### 4. **Custom Hooks**
- **useAuth**: Manages authentication logic (login, register, logout)
- **usePayment**: Manages payment form state and API calls
- Hooks encapsulate business logic for better component reusability

### 5. **Validation & Constants**
- **Validation functions**: IBAN, SWIFT, amount validation
- **Constants**: Currency list, payment providers, API endpoints
- Centralized for easy updates and consistency

## 📦 Common Imports

### Authentication Feature
```javascript
// Pages
import { Login, Register } from '@/features/auth/pages';

// Components
import { LoginForm, RegisterForm } from '@/features/auth/components';

// Hooks
import { useAuth } from '@/features/auth/hooks/useAuth';

// Services
import { authService } from '@/features/auth/services';
```

### Payments Feature
```javascript
// Pages
import { PaymentPortal } from '@/features/payments/pages';

// Components
import { PaymentForm } from '@/features/payments/components';

// Hooks
import { usePayment } from '@/features/payments/hooks/usePayment';

// Validation
import { validatePaymentForm } from '@/features/payments/validation/paymentValidation';

// Constants
import { CURRENCIES, PAYMENT_PROVIDERS } from '@/features/payments/constants/paymentConstants';
```

### Shared Resources
```javascript
// Icons
import { MailIcon, LockIcon, GlobeIcon } from '@/shared/components/icons';

// Utils
import { apiClient, storage } from '@/shared/utils';

// API Client (already has auth token interceptor)
import apiClient from '@/shared/utils/apiClient';
```

## 🚀 Adding New Features

To add a new feature (e.g., `dashboard`):

```
src/features/dashboard/
├── components/
│   ├── DashboardCard.jsx
│   ├── StatsWidget.jsx
│   └── index.js
├── pages/
│   ├── Dashboard.jsx
│   └── index.js
├── services/
│   ├── dashboardService.js
│   └── index.js
├── hooks/
│   └── useDashboard.js
├── styles/
│   └── dashboardStyles.js
├── constants/
│   └── dashboardConstants.js
└── validation/
    └── dashboardValidation.js
```

Then add the route in `App.jsx`:
```javascript
import { Dashboard } from './features/dashboard/pages';

// In Routes
<Route path="/dashboard" element={<Dashboard />} />
```

## 📝 Best Practices

### 1. Import Organization
Always use barrel exports (index.js) for clean imports:
```javascript
// ✅ Good
import { useAuth } from '@/features/auth/hooks';
import { LoginForm } from '@/features/auth/components';

// ❌ Avoid
import useAuth from '@/features/auth/hooks/useAuth.js';
import LoginForm from '@/features/auth/components/LoginForm.jsx';
```

### 2. Service Layer
Keep API calls in services, not directly in components:
```javascript
// ✅ Good - in service
export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post(...);
        return response.data;
    }
};

// ❌ Avoid - directly in component
const login = async (credentials) => {
    const response = await axios.post(...);
};
```

### 3. Custom Hooks
Extract component logic into custom hooks:
```javascript
// ✅ Good - reusable logic
const { login, loading, error } = useAuth();

// ❌ Avoid - logic in component
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
// ... lots of logic in component
```

### 4. Constants & Validation
Keep magic strings out of components:
```javascript
// ✅ Good
import { AUTH_ENDPOINTS } from '@/features/auth/constants/authConstants';

// ❌ Avoid
const response = await api.post('/Auth/login', data);
```

## 🔄 Data Flow

### Authentication Flow
```
LoginForm (component)
    ↓
useAuth hook (custom hook)
    ↓
authService.login() (service layer)
    ↓
apiClient (axios with interceptors)
    ↓
Backend API
    ↓
localStorage (via storage utility)
```

### Payment Flow
```
PaymentForm (component)
    ↓
usePayment hook (custom hook)
    ↓
validatePaymentForm() (validation)
    ↓
paymentService.processPayment() (service layer)
    ↓
apiClient (axios with interceptors)
    ↓
Backend API
```

## 🔐 Security Considerations

- **Auth Token**: Stored in localStorage, automatically added to all API requests
- **API Client Interceptors**: 
  - Request interceptor adds auth token to headers
  - Response interceptor handles 401 errors and redirects to login
- **Input Validation**: All payment forms validated before submission
- **HTTPS Only**: Ensure backend API is accessed over HTTPS in production

## 📚 Related Files

- **main.jsx**: Application entry point
- **App.jsx**: Main routing configuration
- **index.css**: Global styles and animations
- **package.json**: Dependencies and scripts
- **vite.config.js**: Vite configuration with React plugin

## 🎨 Styling Approach

- **Inline Styles Objects**: Used for component-specific styling
- **Tailwind CSS**: Available for utility-first styling
- **CSS Animations**: Global animations in `globals.css`
- **Theme**: Consistent color scheme across the app

## 🚀 Future Improvements

- [ ] Add Context API for global auth state management
- [ ] Implement error boundaries for better error handling
- [ ] Add loading skeletons for better UX
- [ ] Implement testing (Jest, React Testing Library)
- [ ] Add API response caching
- [ ] Implement pagination for large datasets
- [ ] Add accessibility improvements (a11y)
- [ ] Create shared UI component library
- [ ] Add dark/light theme toggle
