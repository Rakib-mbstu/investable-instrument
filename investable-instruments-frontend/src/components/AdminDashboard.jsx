import React, { useState, useEffect } from 'react';
import { fetchPendingPurchases, verifyReceipt } from '../api/adminApi';
import '../styles/adminDashboard.css'
import ReceiptViewer from './ReceiptViewer';

function AdminDashboard() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPendingPurchases();
  }, []);

  const loadPendingPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await fetchPendingPurchases(token);
      setPurchases(data);
    } catch (err) {
      setError('Failed to load pending purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (transactionId, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      await verifyReceipt(transactionId, isApproved, token);
      // Refresh the list after verification
      loadPendingPurchases();
    } catch (err) {
      setError('Failed to verify transaction');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Pending Purchases</h2>
      
      <div className="transactions-grid">
        {purchases.map(purchase => (
          <div key={purchase.id} className="transaction-card">
            <div className="transaction-header">
              <h3>Transaction ID: {purchase.id}</h3>
              <span className={`status status-${purchase.status}`}>
                {purchase.status}
              </span>
            </div>
            
            <div className="transaction-details">
              <p><strong>Instrument:</strong> {purchase.name}</p>
              <p><strong>Units:</strong> {purchase.units}</p>
              <p><strong>Total Amount:</strong> ${purchase.current_price * purchase.units}</p>
              <p><strong>Date:</strong> {new Date(purchase.created_at).toLocaleDateString()}</p>
            </div>

            {purchase.receipt_url && (
              <div className="receipt-preview">
                <h4>Receipt</h4>
                <ReceiptViewer  receiptUrl={`http://localhost:3000/`+purchase.receipt_url}/>
              </div>
            )}

            <div className="transaction-actions">
              <button
                className="approve-btn"
                onClick={() => handleVerify(purchase.id, true)}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleVerify(purchase.id, false)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;