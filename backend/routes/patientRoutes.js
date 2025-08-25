import express from 'express';
import driver from '../config/neo4j.js'; // ✅ AJOUTÉ
import { getPatients, addPatient, deletePatient } from '../controllers/patientController.js';
import { requireLogin, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

//  Route pour récupérer tous les patients (protégée)
router.get('/', requireLogin, requireRole('staff'), getPatients);
router.post('/', requireLogin, requireRole('staff'), addPatient);
router.delete('/:patient_id', requireLogin, requireRole('staff'), deletePatient);

//  Route publique pour les IDs des patients
router.get('/ids', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (p:Patient) RETURN p.patient_id AS id ORDER BY id`);
    const ids = result.records.map(r => r.get('id'));
    res.json(ids);
  } catch (err) {
    console.error('Erreur chargement IDs patients:', err);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    await session.close();
  }
});

export default router;
