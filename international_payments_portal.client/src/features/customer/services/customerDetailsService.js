export const createCustomerDetails = async (data) => {
    const response = await fetch("https://localhost:5001/api/CustomerDetail/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("Save error:", err);
        setMessage(`Failed to save : ${err.message}`);
        
    }

    return result;
};




//h