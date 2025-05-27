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

export async function fetchAllInstruments(token) {
    const response = await fetch(`${API_BASE_URL}/instruments`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch instruments');
    return response.json();
}

export async function createInstrument(instrument) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/instruments/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(instrument),
    });
    if (!response.ok) throw new Error('Failed to create instrument');
    return response.json();
}

export async function updateInstrument(id, instrument) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/instruments/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(instrument),
    });
    if (!response.ok) throw new Error('Failed to update instrument');
    return response.json();
}

export async function deleteInstrument(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/instruments/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete instrument');
    return response.json();
}