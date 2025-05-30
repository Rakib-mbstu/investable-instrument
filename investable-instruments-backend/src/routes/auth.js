import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/switch-role', authController.switchRole);

export default router;