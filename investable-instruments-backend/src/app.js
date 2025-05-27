import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import instrumentRoutes from './routes/instruments.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import instrumentController from './controllers/instrumentController.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Run cleanup every hour
setInterval(() => {
    instrumentController.cleanupExpiredBookings();
}, 60 * 60 * 1000); // 1 hour

// Run cleanup on server start
instrumentController.cleanupExpiredBookings();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
