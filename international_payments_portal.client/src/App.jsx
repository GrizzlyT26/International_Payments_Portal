import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Register, Login } from "./features/auth/pages";
import { PaymentPortal } from "./features/payments/pages";
import VerificationPage from "./features/verification/pages/VerificationPage";
import { CustomerDetailsPortal } from "./features/customer/pages";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/customer-details" element={<CustomerDetailsPortal />} />
                <Route path="/portal" element={<PaymentPortal />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;