const API_BASE_URL = 'http://localhost:3000/api'; // Change to your backend URL

export async function fetchInstruments() {
    const response = await fetch(`${API_BASE_URL}/instruments/`);
    if (!response.ok) {
        throw new Error('Failed to fetch instruments');
    }
    return response.json();
}
export async function fetchInstrumentById(id) {
    const response = await fetch(`${API_BASE_URL}/instruments/${id}/`);
    if (!response.ok) {
        throw new Error('Instrument not found');
    }
    return response.json();
}

export async function fetchOwnedInstruments() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/instruments/owned`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch instruments');
    }
    return response.json();
}

export async function bookInstrument(instrumentId, units) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User not authenticated');
    }
    const response = await fetch(`${API_BASE_URL}/instruments/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ instrumentId, units }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Booking failed');
    }
    return response.json();
}

export async function fetchBookedInstruments() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User not authenticated');
    }
    // const token = localStorage.getItem('token');         
    const response = await fetch(`${API_BASE_URL}/instruments/booked/pending`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch booked instruments');
    }
    return response.json();
}

export async function loginUser(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        throw new Error('Invalid username or password');
    }
    return response.json();
}
export async function uploadReceiptToServer(bookingId, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookingId', bookingId);

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/instruments/upload-receipt`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
    }

    return await response.json();
};
// Example for posting an investment (expand as needed)
export async function investInInstrument(instrumentId, units) {
    const response = await fetch(`${API_BASE_URL}/instruments/${instrumentId}/invest/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ units }),
    });
    if (!response.ok) {
        throw new Error('Investment failed');
    }
    return response.json();
}

export async function registerUser(username, password) {
    const role = 'user'
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'User creation failed');
    }

    return data;
}