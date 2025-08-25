import express from 'express';
import { getTraitements, addTraitement, deleteTraitement } from '../controllers/traitementController.js';
import { requireLogin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireLogin, requireRole('staff'), getTraitements);
router.post('/', requireLogin, requireRole('staff'), addTraitement);
router.delete('/:id', requireLogin, requireRole('staff'), deleteTraitement);

export default router;
