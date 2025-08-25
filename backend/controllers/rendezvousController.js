import RendezvousModel from '../models/rendezvousModel.js';

//  Récupérer TOUS les rendez-vous
export const getRendezvous = async (req, res) => {
  try {
    const data = await RendezvousModel.getAllRendezvous();
    console.log("✅ Données envoyées :", data);
    res.json(data);
  } catch (err) {
    console.error("Erreur récupération de tous les rendez-vous :", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous." });
  }
};

//  Récupérer les rendez-vous d’un patient spécifique
export const getRendezvousByPatient = async (req, res) => {
  const patientId = req.params.id;

  try {
    const rendezvous = await RendezvousModel.getRendezvousByPatient(patientId);
    res.json(rendezvous);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous du patient :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous du patient." });
  }
};

//  Ajouter un nouveau rendez-vous
export const addRendezvous = async (req, res) => {
  const data = req.body;

  console.log("📩 Données reçues pour rendez-vous :", data);

  if (!data.id || !data.date || !data.heure || !data.patientId || !data.medecinId) {
    console.error("❌ Données incomplètes :", data);
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    await RendezvousModel.createRendezvous(data);
    console.log("✅ Rendez-vous ajouté !");
    res.status(201).json({ message: 'Rendez-vous ajouté avec succès.' });
  } catch (error) {
    console.error("⛔ Erreur lors de l'insertion :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du rendez-vous." });
  }
};

//  Supprimer un rendez-vous
export const deleteRendezvous = async (req, res) => {
  const { id } = req.params;

  try {
    await RendezvousModel.deleteRendezvous(id);
    res.json({ message: "Rendez-vous supprimé." });
  } catch (error) {
    console.error("Erreur suppression rendez-vous :", error.message);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
};
