import express from 'express';
import { getMedecins, addMedecin, deleteMedecin } from '../controllers/medecinController.js';
import { requireLogin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

//  Toutes les routes sont protégées
router.get('/', requireLogin, requireRole('staff'), getMedecins);
router.post('/', requireLogin, requireRole('staff'), addMedecin);
router.delete('/:medecin_id', requireLogin, requireRole('staff'), deleteMedecin);

export default router;
