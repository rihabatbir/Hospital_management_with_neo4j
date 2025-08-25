// backend/routes/hystoriqueRoutes.js
import express from 'express';
import { getHistoriqueMedical } from '../controllers/hystoriqueController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/historique', requireAuth, getHistoriqueMedical);

export default router;
