import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookInstrument, fetchInstrumentById } from '../api/api';
import '../styles/bookingInstrument.css';

function BookInstrument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState(1);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    endDate: '',
    purpose: '',
    contactInfo: ''
  });

  useEffect(() => {
    console.log('id here', id);
    
    fetchInstrumentById(id)
      .then(data => {
        setInstrument(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Instrument not found.');
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalCost = () => {
    // if (!instrument) return 0;
    // const dailyRate = instrument.rate_per_day || 0;
    // const startDate = new Date(bookingDetails.startDate);
    // const endDate = new Date(bookingDetails.endDate);
    // const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    // return days > 0 ? days * dailyRate * units : 0;
    return units * (instrument.current_price || 0);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setSubmitting(true);

  try {
    
    const bookedInstrument = await bookInstrument(instrument.id, units);

    // Show success message
    setMessage('Booking request submitted successfully! You will be redirected to upload payment receipt.');

    // Wait before navigating
    setTimeout(() => {
      navigate('/upload-payment', {
        state: {
          bookingId: bookedInstrument.bookingId,
          instrumentName: instrument.name,
          totalCost: calculateTotalCost(),
        },
      });
    }, 1500);
  } catch (error) {
    // Show error message
    setMessage('Booking failed. Please try again.');
  } finally {
    setSubmitting(false);
  }
};


  if (loading) return <div className="loading-container">Loading instrument details...</div>;
  if (!instrument) return <div className="error-container">{message || 'Instrument not found.'}</div>;

  return (
    <div className="booking-container">
      {/* Instrument Details Section */}
      <div className="instrument-details-card">
        <div className="instrument-header">
          <h1>{instrument.name}</h1>
          <span className={`availability-badge ${instrument.available_units > 0 ? 'available' : 'unavailable'}`}>
            {instrument.available_units > 0 ? 'Available' : 'Not Available'}
          </span>
        </div>
        
        <div className="instrument-info-grid">
          {/* <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-item">
              <span className="label">Category:</span>
              <span className="value">{instrument.category || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Model:</span>
              <span className="value">{instrument.model || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Manufacturer:</span>
              <span className="value">{instrument.manufacturer || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Serial Number:</span>
              <span className="value">{instrument.serial_number || 'N/A'}</span>
            </div>
          </div> */}

          <div className="info-section">
            <h3>Availability & Pricing</h3>
            <div className="info-item">
              <span className="label">Available Units:</span>
              <span className="value">{instrument.available_units}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Units:</span>
              <span className="value">{instrument.total_units || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Current Price</span>
              <span className="value">${instrument.current_price || 0}</span>
            </div>
            <div className="info-item">
              <span className="label">Estimated Return:</span>
              <span className="value">{instrument.estimated_return || 0 }%</span>
            </div>
            <div className="info-item">
              <span className="label">Maturity Time</span>
              <span className="value">{instrument.maturity_time || 'N/A'}</span>
            </div>
          </div>
        </div>

        {instrument.description && (
          <div className="description-section">
            <h3>Description</h3>
            <p>{instrument.description}</p>
          </div>
        )}

        {instrument.specifications && (
          <div className="specifications-section">
            <h3>Specifications</h3>
            <p>{instrument.specifications}</p>
          </div>
        )}
      </div>

      {/* Booking Form Section */}
      {instrument.available_units > 0 && (
        <div className="booking-form-card">
          <h2>Book This Instrument</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Units to Book</label>
                <input
                  type="number"
                  min="1"
                  max={instrument.available_units}
                  value={units}
                  onChange={e => setUnits(Number(e.target.value))}
                  required
                />
              </div>
              {/* <div className="form-group">
                <label>Purpose of Use</label>
                <input
                  type="text"
                  name="purpose"
                  value={bookingDetails.purpose}
                  onChange={handleInputChange}
                  placeholder="Research, Testing, etc."
                  required
                />
              </div> */}
            </div>

            {/* <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingDetails.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingDetails.endDate}
                  onChange={handleInputChange}
                  min={bookingDetails.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div> */}

            <div className="form-group">
              <label>Contact Information</label>
              <textarea
                name="contactInfo"
                value={bookingDetails.contactInfo}
                onChange={handleInputChange}
                placeholder="Email, phone number, department, etc."
                rows="3"
                required
              />
            </div>

            {bookingDetails.startDate && bookingDetails.endDate && (
              <div className="cost-summary">
                <h3>Cost Summary</h3>
                <div className="cost-item">
                  <span>Daily Rate:</span>
                  <span>${instrument.rate_per_day}</span>
                </div>
                <div className="cost-item">
                  <span>Number of Days:</span>
                  <span>{Math.ceil((new Date(bookingDetails.endDate) - new Date(bookingDetails.startDate)) / (1000 * 60 * 60 * 24)) + 1}</span>
                </div>
                <div className="cost-item">
                  <span>Units:</span>
                  <span>{units}</span>
                </div>
                
              </div>
            )}
            <div className="cost-item total">
                  <span>Total Cost:</span>
                  <span>${calculateTotalCost()}</span>
                </div>
            <div className="notice-message">
                <p><strong>Note:</strong> The total cost provided is an estimate and may vary depending on actual usage.</p>
                <p>Once an item is booked, it will be held for six hours. You must complete payment and upload the receipt within this time frame.</p>
            </div>

            {message && (
              <div className={message.includes('success') ? 'success-message' : 'error-message'}>
                {message}
              </div>
            )}

            <button className="booking-button" type="submit" disabled={submitting}>
              {submitting ? 'Processing...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookInstrument;