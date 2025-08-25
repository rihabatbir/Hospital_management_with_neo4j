// backend/controllers/hystoriqueController.js
import { fetchHistoriqueMedical } from '../models/hystoriqueModel.js';

export const getHistoriqueMedical = async (req, res) => {
  const email = req.session?.user?.email;

  if (!email) {
    return res.status(401).json({ message: "Patient non connecté" });
  }

  try {
    const historique = await fetchHistoriqueMedical(email);
    res.json(historique);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
