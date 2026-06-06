import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Register, Login, StaffDashboard } from "./features/auth/pages";
import { CustomerTransactions, PaymentPortal } from "./features/payments/pages";
import VerificationPage from "./features/verification/pages/VerificationPage";
import VerifyTransactions from "./features/verification/pages/VerifyTransactions";
import { CustomerDetailsPortal } from "./features/customer/pages";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/staff-verification" element={<VerifyTransactions />} />
                <Route path="/customer-details" element={<CustomerDetailsPortal />} />
                <Route path="/portal" element={<PaymentPortal />} />
                <Route path="/customer-transactions" element={<CustomerTransactions />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
