const API_BASE_URL = 'http://localhost:3000/api';

export const fetchPendingPurchases = async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/pending-purchases`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to fetch pending purchases');
    return response.json();
};

export const verifyReceipt = async (transactionId, isApproved, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/verify-receipt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionId, isApproved }),
    });
    if (!response.ok) throw new Error('Failed to verify receipt');
    return response.json();
};