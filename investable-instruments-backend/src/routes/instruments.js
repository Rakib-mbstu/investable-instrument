import express from 'express';
import multer from 'multer';
import path from 'path';
import instrumentController from '../controllers/instrumentController.js';
import { authenticate } from '../middleware/auth.js';

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

// Route to get all available instruments
router.get('/', instrumentController.getInstruments);

router.get('/owned', authenticate, instrumentController.getOwnedInstruments);

router.get('/:id', instrumentController.getInstrumentById);

// Route to book an instrument
router.post('/book', authenticate, instrumentController.bookInstrument);

router.get('/booked/pending', authenticate, instrumentController.getBookedButNotPaidInstruments);

// Route to upload a bank receipt (with auth and file upload)
router.post(
    '/upload-receipt',
    authenticate,
    upload.single('file'), // 'file' is the key for the uploaded file
    instrumentController.uploadReceipt
);



export default router;