import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import BookInstrument from './components/BookInstrument';
import UploadPaymentReceipt from './components/UploadPaymentReceipt';
import AdminDashboard from './components/AdminDashboard';
import './styles/nav.css'

function NavBar() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">Investment Platform</Link>
      </div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          Home
        </Link>
        
        {token && !isAdmin && (
          <Link 
            to="/upload-payment" 
            className={location.pathname === '/upload-payment' ? 'active' : ''}
          >
            Payments
          </Link>
        )}

        {isAdmin && (
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            Verify Payment
          </Link>
        )}

        {!token ? (
          <>
            <Link 
              to="/login" 
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={location.pathname === '/register' ? 'active' : ''}
            >
              Register
            </Link>
          </>
        ) : (
          <Link 
            to="/logout" 
            className="logout-link"
          >
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/book/:id" element={<BookInstrument />} />
        <Route path='/upload-payment' element={<UploadPaymentReceipt />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;