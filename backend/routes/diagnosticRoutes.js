// backend/routes/diagnosticRoutes.js
import express from 'express';
import { getDiagnostics, addDiagnostic } from '../controllers/diagnosticController.js';

const router = express.Router();

router.get('/', getDiagnostics);
router.post('/', addDiagnostic);

export default router;
