# Investable Instruments Platform (Frontend)

A modern React-based web application for discovering, booking, and managing investable financial instruments. This platform supports user registration, login, instrument booking, payment receipt upload, and an admin dashboard for transaction verification.

## Features

- **User Authentication**: Register, login, and logout functionality.
- **Instrument Marketplace**: Browse available investment instruments and view details.
- **Booking & Payment**: Book instruments and upload payment receipts.
- **Admin Dashboard**: Admins can view, approve, or reject pending transactions and verify payment receipts.
- **Responsive UI**: Clean, professional, and mobile-friendly design.

## Tech Stack

- **Frontend**: React, React Router, CSS Modules
- **API**: Communicates with a RESTful backend (see backend repo)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rakib-mbstu/investable-instrument
   cd investable-instruments-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

### API Configuration

- The frontend expects the backend API to be running (default: `http://localhost:5000`).
- Update `API_BASE_URL` in `src/api/api.js` if your backend runs on a different port or host.

## Project Structure

```
src/
  components/         # React components (Homepage, Login, Register, AdminDashboard, etc.)
  api/                # API utility functions
  styles/             # CSS files for styling
  data/               # Static data (if any)
  App.jsx             # Main app component
  main.jsx            # Entry point
public/               # Static assets
```

## Key Pages

- `/` — Homepage: Browse and book instruments
- `/login` — User login
- `/register` — User registration
- `/book/:id` — Book a specific instrument
- `/upload-payment` — Upload payment receipt for a booking
- `/admin` — Admin dashboard (for admins only)

## Admin Access

- Admin users can log in and access the dashboard at `/admin` to verify or reject transactions.
- The `isAdmin` flag is set in localStorage upon admin login.

## Customization

- Update styles in `src/styles/` for branding or UI changes.
- Extend API calls in `src/api/` as needed.

## License

MIT
