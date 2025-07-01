// This file makes calls to your backend Netlify Functions.
// It abstracts away the `fetch` logic from your components.

const callApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`/.netlify/functions/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `API call failed with status ${response.status}`);
    }

    return response.json();
};


// --- ZB Pay and Payment Functions ---

const initiateZbPayTransaction = (studentId: string, amount: number, termKey: string) => {
    return callApi<{ success: boolean; paymentUrl: string; orderReference: string; transactionId: string; }>('initiateZbPayTransaction', {
        method: 'POST',
        body: JSON.stringify({ studentId, amount, termKey }),
    });
};

const checkZbPaymentStatus = (orderRef: string, txId: string) => {
    return callApi<{ success: boolean; message?: string }>('checkZbPaymentStatus', {
        method: 'POST',
        body: JSON.stringify({ orderRef, txId }),
    });
};


// --- Data Fetching Functions ---

const getAdminDashboardData = () => {
    return callApi<{ stats: any; notifications: any[] }>('getAdminDashboardData');
};

const getTransactionById = (transactionId: string) => {
    return callApi<any>('getTransaction', {
        method: 'POST',
        body: JSON.stringify({ transactionId }),
    });
};


// --- User and Auth Functions ---

const updatePassword = (userId: string, currentPassword: string, newPassword: string) => {
    return callApi<{ success: boolean; message?: string }>('updatePassword', {
        method: 'POST',
        body: JSON.stringify({ userId, currentPassword, newPassword }),
    });
}

// Placeholder for other functions you'll need
// const createStudent = (studentData) => { ... }
// const processCashPayment = (paymentData) => { ... }

export const apiService = {
    initiateZbPayTransaction,
    checkZbPaymentStatus,
    getAdminDashboardData,
    updatePassword,
    getTransactionById
};
