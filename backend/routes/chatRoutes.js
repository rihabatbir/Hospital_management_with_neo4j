import express from 'express';
import { chat } from '../controllers/chatController.js';
import { requireLogin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', requireLogin, requireRole('patient'), chat);

export default router;
