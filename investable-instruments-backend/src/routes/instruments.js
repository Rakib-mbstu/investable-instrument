import express from 'express';
import multer from 'multer';
import path from 'path';
import instrumentController from '../controllers/instrumentController.js';
import { authenticate } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Public routes
router.get('/', instrumentController.getInstruments);
router.get('/:id', instrumentController.getInstrumentById);

// Authenticated user routes
router.get('/owned', authenticate, checkRole(['user']), instrumentController.getOwnedInstruments);
router.post('/book', authenticate, checkRole(['user']), instrumentController.bookInstrument);
router.get('/booked/pending', authenticate, checkRole(['user']), instrumentController.getBookedButNotPaidInstruments);
router.post(
    '/upload-receipt',
    authenticate,
    upload.single('file'),
    instrumentController.uploadReceipt
);

// Admin routes
router.post(
    '/admin/create',
    authenticate,
    checkRole(['admin']),
    instrumentController.createInstrument
);

router.put(
    '/admin/:id',
    authenticate,
    checkRole(['admin']),
    instrumentController.updateInstrument
);

router.delete(
    '/admin/:id',
    authenticate,
    checkRole(['admin']),
    instrumentController.deleteInstrument
);

export default router;