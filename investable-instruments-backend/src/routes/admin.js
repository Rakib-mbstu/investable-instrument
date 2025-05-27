import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { checkRole } from '../middleware/role.js';

const router = express.Router();

// Use controller methods directly as handlers
router.get('/pending-purchases', authenticate, checkRole(['admin']), adminController.viewPendingPurchases);
router.post('/verify-receipt', authenticate, checkRole(['admin']), adminController.verifyReceipt);
router.post('/approve', authenticate, checkRole(['admin']), adminController.approveTransaction);
router.post('/reject/', authenticate, checkRole(['admin']), adminController.rejectTransaction);

export default router;