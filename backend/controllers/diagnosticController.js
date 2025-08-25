// backend/controllers/diagnosticController.js
import DiagnosticModel from '../models/diagnosticModel.js';

export const getDiagnostics = async (req, res) => {
  try {
    const diagnostics = await DiagnosticModel.getAllDiagnostics();
    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des diagnostics.' });
  }
};

export const addDiagnostic = async (req, res) => {
  try {
    const diagnostic = req.body;
    await DiagnosticModel.createDiagnostic(diagnostic);
    res.status(201).json({ message: 'Diagnostic ajouté avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du diagnostic.' });
  }
};
