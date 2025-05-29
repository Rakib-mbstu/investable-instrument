import React from 'react';
import { Link } from 'react-router-dom';
import { DollarIcon, TrendingIcon, ClockIcon, PackageIcon, CalendarIcon } from '../assets/icons';
import '../styles/instrument.css';

function InstrumentCard({ instrument, owned }) {
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="instrument-card">
      <div className="card-header">
        <h3>{instrument.name}</h3>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <div className="detail-icon icon-green">
            <DollarIcon />
          </div>
          <div className="detail-content">
            <p className="detail-label">Current Price</p>
            <p className="detail-value">{formatCurrency(instrument.current_price)}</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon icon-blue">
            <TrendingIcon />
          </div>
          <div className="detail-content">
            <p className="detail-label">Expected Return</p>
            <p className="detail-value">{instrument.estimated_return}%</p>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon icon-orange">
            <ClockIcon />
          </div>
          <div className="detail-content">
            <p className="detail-label">Maturity Time</p>
            <p className="detail-value">
              {instrument.maturity_time > 0 ? `${instrument.maturity_time} days` : 'N/A'}
            </p>
          </div>
        </div>

        {!owned && (
          <div className="detail-item">
            <div className="detail-icon icon-purple">
              <PackageIcon />
            </div>
            <div className="detail-content">
              <p className="detail-label">Available Units</p>
              <p className="detail-value">{instrument.available_units.toLocaleString()}</p>
            </div>
          </div>
        )}

        {instrument.units > 0 && (
          <div className="detail-item">
            <div className="detail-icon icon-purple">
              <PackageIcon />
            </div>
            <div className="detail-content">
              <p className="detail-label">Owned Units</p>
              <p className="detail-value">{instrument.units}</p>
            </div>
          </div>
        )}

        {owned && (
          <div className="detail-item">
            <div className="detail-icon icon-blue">
              <CalendarIcon />
            </div>
            <div className="detail-content">
              <p className="detail-label">Buying Date</p>
              <p className="detail-value">{formatDate(instrument.updated_at)}</p>
            </div>
          </div>
        )}
      </div>

      {!owned && (
        <div className="card-footer">
          <Link to={`/book/${instrument.id}`} className="footer-btn submit-btn">
            Book & Upload Receipt
          </Link>
        </div>
      )}
    </div>
  );
}

export default InstrumentCard;