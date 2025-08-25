import express from 'express';
import { getMedecinInfos, getAllMedecins } from '../controllers/staffController.js';

const router = express.Router();

router.get('/medecin-infos', getMedecinInfos);
router.get('/all-medecins', getAllMedecins);

export default router;
