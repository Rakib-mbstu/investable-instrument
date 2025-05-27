import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/instrument.css'; 

function InstrumentCard({ instrument, owned }) {
  // Helper to format date in readable format
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="instrument-card">
      <div className="instrument-card-header">
        <h2>{instrument.name}</h2>
      </div>
      <div className="instrument-card-body">
        <div className="instrument-detail">
          <span className="label">Current Price:</span>
          <span className="value">${instrument.current_price}</span>
        </div>
        <div className="instrument-detail">
          <span className="label">Estimated Return:</span>
          <span className="value">{instrument.estimated_return}%</span>
        </div>
        <div className="instrument-detail">
          <span className="label">Maturity Time:</span>
          <span className="value">
            {instrument.maturity_time > 0
              ? `${instrument.maturity_time} days`
              : 'N/A'}
          </span>
        </div>
        {!owned && <div className="instrument-detail">
          <span className="label">Available Units:</span>
          <span className="value">{instrument.available_units}</span>
        </div>}
        {instrument.units > 0 && <div className="instrument-detail">
          <span className="label">Owned Units:</span>
          <span className="value">{instrument.units}</span>
        </div>}
        {owned && <div className="instrument-detail">
          <span className="label">Buying date:</span>
          <span className="value">{formatDate(instrument.updated_at)}</span>
        </div>}
      </div>
      {!owned && <div className="instrument-card-footer">
        <Link to={`/book/${instrument.id}`}>
          <button className="invest-btn">Book & Upload Receipt</button>
        </Link>
      </div>}
    </div>
  );
}

export default InstrumentCard;