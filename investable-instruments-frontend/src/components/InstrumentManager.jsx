import React, { useState, useEffect } from 'react';
import '../styles/instrumentManager.css';
import { PlusIcon,
    EditIcon,
    TrashIcon,
    DollarIcon,
    TrendingIcon,
    ClockIcon,
    PackageIcon } from '../assets/icons';
import { fetchInstruments } from '../api/api';
import { createInstrument,updateInstrument,deleteInstrument } from '../api/adminApi';

function InstrumentManager() {
  const [instruments, setInstruments] = useState([]);
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [instrumentForm, setInstrumentForm] = useState({
    name: '',
    current_price: '',
    estimated_return: '',
    maturity_time: '',
    available_units: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadInstruments();
  }, []);

  const loadInstruments = async () => {
    setLoading(true);
    try {
      const data = await fetchInstruments();
      setInstruments(data);
      setError(null);
    } catch {
      setError('Failed to load instruments');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setInstrumentForm({ ...instrumentForm, [e.target.name]: e.target.value });
  };

  const handleInstrumentSubmit = async () => {
    setLoading(true);
    try {
      if (editingInstrument) {
        await updateInstrument(editingInstrument.id, instrumentForm);
        setInstruments(prev => prev.map(inst => 
          inst.id === editingInstrument.id 
            ? { ...instrumentForm, id: editingInstrument.id, current_price: Number(instrumentForm.current_price), estimated_return: Number(instrumentForm.estimated_return), maturity_time: Number(instrumentForm.maturity_time), available_units: Number(instrumentForm.available_units) }
            : inst
        ));
      } else {
        const newInstrument = await createInstrument({
          ...instrumentForm,
          current_price: Number(instrumentForm.current_price),
          estimated_return: Number(instrumentForm.estimated_return),
          maturity_time: Number(instrumentForm.maturity_time),
          available_units: Number(instrumentForm.available_units)
        });
        setInstruments(prev => [...prev, newInstrument]);
      }
      
      setEditingInstrument(null);
      setShowForm(false);
      setInstrumentForm({
        name: '',
        current_price: '',
        estimated_return: '',
        maturity_time: '',
        available_units: '',
      });
      setError(null);
    } catch {
      setError('Failed to save instrument');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instrument) => {
    setEditingInstrument(instrument);
    setShowForm(true);
    setInstrumentForm({
      name: instrument.name,
      current_price: instrument.current_price.toString(),
      estimated_return: instrument.estimated_return.toString(),
      maturity_time: instrument.maturity_time.toString(),
      available_units: instrument.available_units.toString(),
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instrument?')) {
      setLoading(true);
      try {
        await deleteInstrument(id);
        setInstruments(prev => prev.filter(inst => inst.id !== id));
        setError(null);
      } catch {
        setError('Failed to delete instrument');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelForm = () => {
    setEditingInstrument(null);
    setShowForm(false);
    setInstrumentForm({
      name: '',
      current_price: '',
      estimated_return: '',
      maturity_time: '',
      available_units: '',
    });
    setError(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Financial Instruments</h1>
              <p>Manage and monitor investment instruments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="add-instrument-btn"
              disabled={loading}
            >
              <PlusIcon />
              Add Instrument
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="admin-error">
            <div className="error-content">
              <div className="error-dot"></div>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="instrument-form-container">
            <div className="form-header">
              <EditIcon />
              <h2>{editingInstrument ? 'Edit Instrument' : 'Create New Instrument'}</h2>
            </div>
            
            <div className="instrument-form">
              <div className="form-group">
                <label>Instrument Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter instrument name"
                  value={instrumentForm.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Price ($)</label>
                <input
                  name="current_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={instrumentForm.current_price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Return (%)</label>
                <input
                  name="estimated_return"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={instrumentForm.estimated_return}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Maturity Time (days)</label>
                <input
                  name="maturity_time"
                  type="number"
                  placeholder="365"
                  value={instrumentForm.maturity_time}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Available Units</label>
                <input
                  name="available_units"
                  type="number"
                  placeholder="100"
                  value={instrumentForm.available_units}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={handleInstrumentSubmit}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Saving...' : (editingInstrument ? 'Update Instrument' : 'Create Instrument')}
              </button>
              <button
                onClick={cancelForm}
                disabled={loading}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !showForm && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading instruments...</span>
          </div>
        )}

        {/* Instruments Grid */}
        {!loading && (
          <div className="instruments-grid">
            {instruments.map((inst) => (
              <div key={inst.id} className="instrument-card">
                <div className="card-header">
                  <h3>{inst.name}</h3>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(inst)}
                      className="action-btn edit-btn"
                      title="Edit instrument"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(inst.id)}
                      className="action-btn delete-btn"
                      title="Delete instrument"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-item">
                    <div className="detail-icon icon-green">
                      <DollarIcon />
                    </div>
                    <div className="detail-content">
                      <p className="detail-label">Current Price</p>
                      <p className="detail-value">{formatCurrency(inst.current_price)}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon icon-blue">
                      <TrendingIcon />
                    </div>
                    <div className="detail-content">
                      <p className="detail-label">Expected Return</p>
                      <p className="detail-value">{inst.estimated_return}%</p>
                    </div>
                  </div>

                    <div className="detail-item">
                      <div className="detail-icon icon-orange">
                        <ClockIcon />
                      </div>
                      <div className="detail-content">
                        <p className="detail-label">Maturity</p>
                        <p className="detail-value">{inst.maturity_time} days</p>
                      </div>
                    </div>

                  <div className="detail-item">
                    <div className="detail-icon icon-purple">
                      <PackageIcon />
                    </div>
                    <div className="detail-content">
                      <p className="detail-label">Available Units</p>
                      <p className="detail-value">{inst.available_units.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="footer-actions">
                    <button
                      onClick={() => handleEdit(inst)}
                      className="footer-btn edit-footer-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inst.id)}
                      className="footer-btn delete-footer-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && instruments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <PackageIcon />
              </div>
            <h2>No Instruments Available</h2>
            <p>
              It seems there are no financial instruments available at the moment.
              Click the button above to add a new instrument.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="add-instrument-btn"
              disabled={loading}
            >
              <PlusIcon />
              Add Instrument
            </button>
          </div>
        )}
      </div>
    </div>                              
    );
}
export default InstrumentManager;
