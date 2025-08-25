// backend/controllers/patientController.js
import PatientModel from '../models/patientModel.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await PatientModel.getAllPatients();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des patients.' });
  }
};

export const addPatient = async (req, res) => {
  try {
    const patient = req.body;
    await PatientModel.createPatient(patient);
    res.status(201).json({ message: 'Patient ajouté avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du patient.' });
  }
};
export const deletePatient = async (req, res) => {
  const { patient_id } = req.params;
  try {
    await PatientModel.deletePatient(patient_id);
    res.json({ message: 'Patient supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du patient.' });
  }
};
