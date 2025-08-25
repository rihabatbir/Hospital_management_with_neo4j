// backend/routes/rendezvousRoutes.js
import express from 'express';
import {
  getRendezvous,
  addRendezvous,
  getRendezvousByPatient,
  deleteRendezvous
} from '../controllers/rendezvousController.js';

const router = express.Router();

router.get('/', getRendezvous); // 🔁 Récupère tous les rendez-vous
router.post('/', addRendezvous); // ➕ Ajoute un rendez-vous
router.get('/patient/:id', getRendezvousByPatient); // 🔍 Rendez-vous par patient
router.delete('/:id', deleteRendezvous);

export default router;
