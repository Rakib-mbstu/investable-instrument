import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBookedInstruments, uploadReceiptToServer } from '../api/api';

function UploadPaymentReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiBookings = await fetchBookedInstruments(token);

        const mappedBookings = apiBookings.map(b => ({
          id: b.transaction_id,
          instrumentName: b.name,
          bookingDate: new Date(b.created_at).toISOString().split('T')[0],
          totalCost: b.current_price * b.units,
          status: b.status,
        }));

        setBookings(mappedBookings);

        if (location.state && location.state.bookingId) {
          setSelectedBooking(location.state.bookingId);
        }
      } catch (err) {
        setMessage('Failed to load bookings.');
      }
    };

    fetchData();
  }, [location.state]);

  const validateFile = (file) => {
    const maxSize = 1 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, and PDF files are allowed');
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    try {
      validateFile(file);
      setReceipt(file);
      setMessage(''); // Clear any previous error messages
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl('');
      }
    } catch (error) {
      setMessage(error.message);
      setReceipt(null);
      setPreviewUrl('');
      e.target.value = ''; // Clear the input
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBooking || !receipt) {
      setMessage('Please select a booking and upload a receipt.');
      return;
    }

    setMessage('');
    setSubmitting(true);

    try {
      // Upload to server
      const result = await uploadReceiptToServer(selectedBooking, receipt);
      
      setMessage('Payment receipt uploaded successfully! Your booking will be processed shortly.');
      
      // Clear form
      setSelectedBooking('');
      setReceipt(null);
      setPreviewUrl('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectedBookingDetails = bookings.find(b => b.id === selectedBooking);

  return (
    <div className="payment-upload-container">
      <div className="payment-upload-card">
        <h2>Upload Payment Receipt</h2>
        <p className="instruction-text">
          Select your booking and upload the payment receipt to complete your instrument reservation.
        </p>

        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Booking</label>
            <select
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              required
            >
              <option value="">-- Select a booking --</option>
              {bookings.map(booking => (
                <option key={booking.id} value={booking.id}>
                  {booking.instrumentName} - {booking.bookingDate} (${booking.totalCost})
                </option>
              ))}
            </select>
          </div>

          {selectedBookingDetails && (
            <div className="booking-summary">
              <h3>Booking Details</h3>
              <div className="summary-item">
                <span className="label">Booking ID:</span>
                <span className="value">{selectedBookingDetails.id}</span>
              </div>
              <div className="summary-item">
                <span className="label">Instrument:</span>
                <span className="value">{selectedBookingDetails.instrumentName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Booking Date:</span>
                <span className="value">{selectedBookingDetails.bookingDate}</span>
              </div>
              <div className="summary-item">
                <span className="label">Total Amount:</span>
                <span className="value total-amount">${selectedBookingDetails.totalCost}</span>
              </div>
              <div className="summary-item">
                <span className="label">Status:</span>
                <span className="value status">{selectedBookingDetails.status.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Upload Payment Receipt</label>
            <div className="file-upload-area">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileChange}
                required
              />
              <div className="file-upload-info">
                <p>Accepted formats: JPG, PNG, PDF</p>
                <p>Max file size: 1MB</p>
              </div>
            </div>
          </div>

          {previewUrl && (
            <div className="receipt-preview">
              <h4>Receipt Preview</h4>
              <img src={previewUrl} alt="Receipt preview" style={{maxWidth: '100%', maxHeight: '300px'}} />
            </div>
          )}

          {receipt && !previewUrl && (
            <div className="file-info">
              <p><strong>Selected file:</strong> {receipt.name}</p>
              <p><strong>File size:</strong> {(receipt.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>File type:</strong> {receipt.type}</p>
            </div>
          )}

          {message && (
            <div className={message.includes('success') ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}

          <button className="upload-button" type="submit" disabled={submitting || !receipt || !selectedBooking}>
            {submitting ? 'Uploading...' : 'Upload Receipt'}
          </button>
        </form>

        <div className="help-section">
          <h3>Payment Instructions</h3>
          <ul>
            <li>Make payment to the designated account</li>
            <li>Keep your payment receipt/transaction proof</li>
            <li>Upload a clear photo or scan of the receipt</li>
            <li>Include booking ID in payment reference if possible</li>
            <li>Contact support if you face any issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadPaymentReceipt;