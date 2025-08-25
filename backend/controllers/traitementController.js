// backend/controllers/traitementController.js
import TraitementModel from '../models/traitementModel.js';


export const getTraitements = async (req, res) => {
  try {
    console.log("📥 Requête GET /traitements déclenchée");

    const traitements = await TraitementModel.getAllTraitements();

    console.log("✅ Données renvoyées :", traitements);

    res.json(traitements);
  } catch (error) {
    console.error("❌ Erreur traitement :", error);
    res.status(500).json({ error: 'Erreur lors de la récupération des traitements.' });
  }
};
;

export const addTraitement = async (req, res) => {
  try {
    const traitement = req.body;
    await TraitementModel.createTraitement(traitement);
    res.status(201).json({ message: 'Traitement ajouté avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du traitement.' });
  }
};
export const deleteTraitement = async (req, res) => {
  const { id } = req.params;
  try {
    await TraitementModel.deleteTraitement(id);
    res.json({ message: 'Traitement supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du traitement.' });
  }
};
