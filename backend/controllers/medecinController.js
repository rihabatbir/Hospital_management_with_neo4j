import MedecinModel from '../models/medecinModel.js';

export const getMedecins = async (req, res) => {
  try {
    const medecins = await MedecinModel.getAllMedecins();
    res.json(medecins); //  renvoyer un tableau
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des médecins.' });
  }
};

export const addMedecin = async (req, res) => {
  try {
    const medecin = req.body;
    await MedecinModel.createMedecin(medecin);
    res.status(201).json({ message: 'Médecin ajouté avec succès.' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du médecin." });
  }
};

export const deleteMedecin = async (req, res) => {
  const { medecin_id } = req.params;
  try {
    await MedecinModel.deleteMedecin(medecin_id);
    res.json({ message: 'Médecin supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du médecin.' });
  }
};
