# Investable Instruments Backend

A Node.js backend application for managing investment instruments, user transactions, and administrative operations.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

```bash
git clone https://github.com/Rakib-mbstu/investable-instrument
cd investable-instruments-backend
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=investable_instruments
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

## Database Setup

```bash
# Create the database
createdb investable_instruments

# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

## Creating Migrations

```bash
npx knex migrate:make migration_name
```

### Sample Migration

```javascript
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username").unique().notNullable();
      table.string("password").notNullable();
      table.string("role").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("instruments", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.decimal("current_price").notNullable();
      table.decimal("estimated_return").notNullable();
      table.timestamp("maturity_time").notNullable();
      table.integer("available_units").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("transactions", (table) => {
      table.uuid("id").primary();
      table.integer("user_id").references("id").inTable("users");
      table.integer("instrument_id").references("id").inTable("instruments");
      table.integer("units").notNullable();
      table.string("status").notNullable();
      table.timestamp("booked_at").notNullable();
      table.timestamp("expires_at").notNullable();
      table.string("receipt_url").nullable();
      table.timestamp("verified_at").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Instruments

Public Routes:

- `GET /api/instruments` - List all instruments
- `GET /api/instruments/:id` - Get instrument details

User Routes (requires authentication):

- `POST /api/instruments/book` - Book an instrument
- `GET /api/instruments/owned` - Get user's owned instruments
- `GET /api/instruments/booked/pending` - Get pending bookings
- `POST /api/instruments/upload-receipt` - Upload payment receipt

Admin Routes (requires admin role):

- `POST /api/instruments/admin/create` - Create new instrument
- `PUT /api/instruments/admin/:id` - Update instrument
- `DELETE /api/instruments/admin/:id` - Delete instrument

### Admin

- `GET /api/admin/pending-purchases` - View pending purchases
- `POST /api/admin/verify-receipt` - Verify receipt
- `POST /api/admin/approve` - Approve transaction
- `POST /api/admin/reject` - Reject transaction

## Package.json Scripts

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "migrate": "knex migrate:latest",
    "migrate:rollback": "knex migrate:rollback",
    "seed": "node src/db/seed.js"
  }
}
```

## Project Structure

```
src/
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── instrumentController.js
├── models/
│   ├── user.js
│   ├── instrument.js
│   └── transaction.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   └── instruments.js
├── db/
│   ├── migrations/
│   ├── seeds/
│   └── index.js
├── middleware/
│   ├── auth.js
│   └── role.js
└── app.js
```

## File Upload Setup

```bash
mkdir uploads
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Examples

### Creating an Instrument (Admin)

```http
POST /api/instruments/admin/create
Content-Type: application/json
Authorization: Bearer <token>

{
    "name": "Government Bond 2025",
    "currentPrice": 1000.50,
    "estimatedReturn": 8.5,
    "maturityTime": "2025-12-31",
    "availableUnits": 100
}
```

### Updating an Instrument (Admin)

```http
PUT /api/instruments/admin/1
Content-Type: application/json
Authorization: Bearer <token>

{
    "currentPrice": 1050.75,
    "availableUnits": 95
}
```

### Booking an Instrument (User)

```http
POST /api/instruments/book
Content-Type: application/json
Authorization: Bearer <token>

{
    "instrumentId": 1,
    "units": 5
}
```

### Uploading Receipt

```http
POST /api/instruments/upload-receipt
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <receipt_file>
bookingId: <booking_id>
```
