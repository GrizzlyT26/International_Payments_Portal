import { useState } from "react";
import { paymentStyles, handleInputFocus, handleInputBlur } from "../../payments/styles/paymentStyles";
import { BankIcon, NoteIcon } from "../../../shared/components/icons";
import { createCustomerDetails } from "../services/customerDetailsService";
import { useNavigate } from "react-router-dom";
import { validateCustomerForm } from "../validation/customerValidation";

export const CustomerDetailsForm = () => {
    const [formData, setFormData] = useState({
        accountHolder: "",
        accountNumber: "",
        branchCode: "",
        accountType: "Savings",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // ✅ Use validation file
        const errors = validateCustomerForm(formData);

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});

        try {
            await createCustomerDetails({
                ...formData,
                userId: 1
            });

            setMessage("✅ Saved successfully");

            setTimeout(() => {
                navigate("/portal");
            }, 1000);

        } catch (err) {
            console.error("Save error:", err);
            setMessage(`❌ Failed to save: ${err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>

            {message && <div style={paymentStyles.successBox}>{message}</div>}

            {/* Account Holder */}
            <label style={paymentStyles.label}>Account Holder</label>
            <div style={paymentStyles.inputWrap}>
                <div style={paymentStyles.iconSlot}><NoteIcon /></div>
                <input
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                        ...paymentStyles.input,
                        borderColor: fieldErrors.accountHolder
                            ? 'rgba(239,68,68,0.5)'
                            : 'rgba(99,179,237,0.13)',
                    }}
                />
            </div>
            {fieldErrors.accountHolder && (
                <div style={{ color: '#fca5a5', fontSize: 12 }}>
                    {fieldErrors.accountHolder}
                </div>
            )}

            {/* Account Number */}
            <label style={paymentStyles.label}>Account Number</label>
            <div style={paymentStyles.inputWrap}>
                <div style={paymentStyles.iconSlot}><BankIcon /></div>
                <input
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                        ...paymentStyles.input,
                        borderColor: fieldErrors.accountNumber
                            ? 'rgba(239,68,68,0.5)'
                            : 'rgba(99,179,237,0.13)',
                    }}
                />
            </div>
            {fieldErrors.accountNumber && (
                <div style={{ color: '#fca5a5', fontSize: 12 }}>
                    {fieldErrors.accountNumber}
                </div>
            )}

            {/* Branch Code */}
            <label style={paymentStyles.label}>Branch Code</label>
            <div style={paymentStyles.inputWrap}>
                <div style={paymentStyles.iconSlot}><BankIcon /></div>
                <input
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={{
                        ...paymentStyles.input,
                        borderColor: fieldErrors.branchCode
                            ? 'rgba(239,68,68,0.5)'
                            : 'rgba(99,179,237,0.13)',
                    }}
                />
            </div>
            {fieldErrors.branchCode && (
                <div style={{ color: '#fca5a5', fontSize: 12 }}>
                    {fieldErrors.branchCode}
                </div>
            )}

            {/* Account Type */}
            <label style={paymentStyles.label}>Account Type</label>
            <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                style={paymentStyles.select}
            >
                <option>Savings</option>
                <option>Current</option>
                <option>Business</option>
            </select>

            <button type="submit" style={{ ...paymentStyles.btn, marginTop: 20 }}>
                Save 
            </button>
        </form>
    );
};

export default CustomerDetailsForm;
























































































































//WORKS PERFECTLYI JUST WANT TO VALIDATE ***
//import { useState } from "react";
//import { paymentStyles, handleInputFocus, handleInputBlur } from "../../payments/styles/paymentStyles";
//import { BankIcon, NoteIcon } from "../../../shared/components/icons";
//import { createCustomerDetails } from "../services/customerDetailsService";
//import { useNavigate } from "react-router-dom";
//import { validateCustomerForm } from "../validation/customerValidation";

//export const CustomerDetailsForm = () => {
//    const [formData, setFormData] = useState({
//        accountHolder: "",
//        accountNumber: "",
//        branchCode: "",
//        accountType: "Savings",
//    });

//    const [fieldErrors, setFieldErrors] = useState({});
//    const [message, setMessage] = useState("");

//    const navigate = useNavigate(); // ✅ initialize navigation (its not doing it !!!!)

//    const handleChange = (e) => {
//        const { name, value } = e.target;

//        setFormData(prev => ({ ...prev, [name]: value }));

//        if (fieldErrors[name]) {
//            setFieldErrors(prev => ({ ...prev, [name]: "" }));
//        }
//    };

//    const validate = () => {
//        const errors = {};
//        if (!formData.accountHolder) errors.accountHolder = "Required";
//        if (!formData.accountNumber) errors.accountNumber = "Required";
//        if (!formData.branchCode) errors.branchCode = "Required";
//        return errors;
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setMessage("");

//        const errors = validate();
//        if (Object.keys(errors).length > 0) {
//            setFieldErrors(errors);
//            return;
//        }

//        try {
//            await createCustomerDetails({
//                ...formData,
//                userId: 1
//            });

//            setMessage("✅ Saved successfully");

//            // Optional delay so user sees success message
//            setTimeout(() => {
//                navigate("/portal");
//            }, 1000);

//        } catch (err) {
//            console.error("Save error:", err);
//            setMessage(`❌ Failed to save: ${err.message}`);
//        }
//    };

//    return (
//        <form onSubmit={handleSubmit} noValidate>

//            {message && <div style={paymentStyles.successBox}>{message}</div>}

//            <label style={paymentStyles.label}>Account Holder</label>
//            <div style={paymentStyles.inputWrap}>
//                <div style={paymentStyles.iconSlot}><NoteIcon /></div>
//                <input
//                    name="accountHolder"
//                    value={formData.accountHolder}
//                    onChange={handleChange}
//                    onFocus={handleInputFocus}
//                    onBlur={handleInputBlur}
//                    style={paymentStyles.input}
//                />
//            </div>

//            <label style={paymentStyles.label}>Account Number</label>
//            <div style={paymentStyles.inputWrap}>
//                <div style={paymentStyles.iconSlot}><BankIcon /></div>
//                <input
//                    name="accountNumber"
//                    value={formData.accountNumber}
//                    onChange={handleChange}
//                    onFocus={handleInputFocus}
//                    onBlur={handleInputBlur}
//                    style={paymentStyles.input}
//                />
//            </div>

//            <label style={paymentStyles.label}>Branch Code</label>
//            <div style={paymentStyles.inputWrap}>
//                <div style={paymentStyles.iconSlot}><BankIcon /></div>
//                <input
//                    name="branchCode"
//                    value={formData.branchCode}
//                    onChange={handleChange}
//                    onFocus={handleInputFocus}
//                    onBlur={handleInputBlur}
//                    style={paymentStyles.input}
//                />
//            </div>

//            <label style={paymentStyles.label}>Account Type</label>
//            <select
//                name="accountType"
//                value={formData.accountType}
//                onChange={handleChange}
//                style={paymentStyles.select}
//            >
//                <option>Savings</option>
//                <option>Current</option>
//                <option>Business</option>
//            </select>
//            <button type="submit" style={{ ...paymentStyles.btn, marginTop: 20 }}>
//                Save
//            </button>
//        </form>
//    );
//};
//export default CustomerDetailsForm;
//WORKS PERFECTLY I JUST WANT TO VLIDATE 
































































//currently workin - but testing routing above (redirect) 
//import { useState } from "react";
//import { paymentStyles, handleInputFocus, handleInputBlur } from "../../payments/styles/paymentStyles";
//import { BankIcon, NoteIcon } from "../../../shared/components/icons";
//import { createCustomerDetails } from "../services/customerDetailsService";
//import { useNavigate } from "react-router-dom";


//export const CustomerDetailsForm = () => {
//    const [formData, setFormData] = useState({
//        accountHolder: "",
//        accountNumber: "",
//        branchCode: "",
//        accountType: "Savings",
//    });

//    const [fieldErrors, setFieldErrors] = useState({});
//    const [message, setMessage] = useState("");

//    const handleChange = (e) => {
//        const { name, value } = e.target;

//        setFormData(prev => ({ ...prev, [name]: value }));

//        if (fieldErrors[name]) {
//            setFieldErrors(prev => ({ ...prev, [name]: "" }));
//        }
//    };

//    const validate = () => {
//        const errors = {};
//        if (!formData.accountHolder) errors.accountHolder = "Required";
//        if (!formData.accountNumber) errors.accountNumber = "Required";
//        if (!formData.branchCode) errors.branchCode = "Required";
//        return errors;
//    };


//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setMessage("");

//        const errors = validate();
//        if (Object.keys(errors).length > 0) {
//            setFieldErrors(errors);
//            return;
//        }

//        try {
//            await createCustomerDetails({
//                ...formData,
//                userId: 1
//            });

//            setMessage("✅ Saved successfully");

//            setFormData({
//                accountHolder: "",
//                accountNumber: "",
//                branchCode: "",
//                accountType: "Savings",
//            });

//        } catch (err) {
//            console.error("Save error:", err);
//            setMessage(`❌ Failed to save: ${err.message}`);
//        }
//    };

//    return (
//        <form onSubmit={handleSubmit} noValidate>

//            {message && <div style={paymentStyles.successBox}>{message}</div>}

//            <label style={paymentStyles.label}>Account Holder</label>
//            <div style={paymentStyles.inputWrap}>
//                <div style={paymentStyles.iconSlot}><NoteIcon /></div>
//                <input name="accountHolder" value={formData.accountHolder}
//                    onChange={handleChange} onFocus={handleInputFocus} onBlur={handleInputBlur}
//                    style={paymentStyles.input} />
//            </div>

//            <label style={paymentStyles.label}>Account Number</label>
//            <div style={paymentStyles.inputWrap}>
//                <div style={paymentStyles.iconSlot}><BankIcon /></div>
//                <input name="accountNumber" value={formData.accountNumber}
//                    onChange={handleChange} onFocus={handleInputFocus} onBlur={handleInputBlur}
//                    style={paymentStyles.input} />
//            </div>

//            <label style={paymentStyles.label}>Branch Code</label>
//            <div style={paymentStyles.inputWrap}>
//                <div style={paymentStyles.iconSlot}><BankIcon /></div>
//                <input name="branchCode" value={formData.branchCode}
//                    onChange={handleChange} onFocus={handleInputFocus} onBlur={handleInputBlur}
//                    style={paymentStyles.input} />
//            </div>

//            <label style={paymentStyles.label}>Account Type</label>
//            <select name="accountType" value={formData.accountType}
//                onChange={handleChange} style={paymentStyles.select}>
//                <option>Savings</option>
//                <option>Current</option>
//                <option>Business</option>
//            </select>

//            <button type="submit" style={{ ...paymentStyles.btn, marginTop: 20 }}>
//                Save Customer Details
//            </button>
//        </form>
//    );
//};

//export default CustomerDetailsForm;