// backend/models/rendezvousModel.js
import driver from '../config/neo4j.js';

//  Créer un rendez-vous
const createRendezvous = async ({ id, date, heure, patientId, medecinId }) => {
  const session = driver.session();
  console.log("📩 Requête reçue :", { id, date, heure, patientId, medecinId });

  try {
    const verifyResult = await session.run(`
      MATCH (p:Patient {patient_id: $patientId})
      MATCH (m:Medecin {medecin_id: $medecinId})
      RETURN p, m
    `, { patientId, medecinId });

    if (verifyResult.records.length === 0) {
      console.log("❌ Patient ou médecin non trouvé !");
      throw new Error("Patient ou Médecin introuvable");
    }

    await session.run(`
      MATCH (p:Patient {patient_id: $patientId})
      MATCH (m:Medecin {medecin_id: $medecinId})
      CREATE (r:RendezVous {id: $id, date: $date, heure: $heure})
      CREATE (r)-[:A_POUR_PATIENT]->(p)
      CREATE (r)-[:A_POUR_MEDECIN]->(m)
      RETURN r, p, m
    `, { id, date, heure, patientId, medecinId });

    console.log("✅ Rendez-vous enregistré avec relations.");
  } catch (err) {
    console.error("❌ Erreur Neo4j :", err.message);
    throw err;
  } finally {
    await session.close();
  }
};

// Récupérer tous les rendez-vous
const getAllRendezvous = async () => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (r:RendezVous)-[:A_POUR_PATIENT]->(p:Patient),
            (r)-[:A_POUR_MEDECIN]->(m:Medecin)
      RETURN r.id AS id, r.date AS date, r.heure AS heure,
             p.patient_id AS patientId, p.nom AS nomPatient, p.prenom AS prenomPatient,
             m.medecin_id AS medecinId, m.nom AS nomMedecin, m.prenom AS prenomMedecin
      ORDER BY r.date, r.heure
    `);

    return result.records.map(r => ({
      id: r.get("id"),
      date: r.get("date"),
      heure: r.get("heure"),
      patientId: r.get("patientId"),
      nomPatient: r.get("nomPatient"),
      prenomPatient: r.get("prenomPatient"),
      medecinId: r.get("medecinId"),
      nomMedecin: r.get("nomMedecin"),
      prenomMedecin: r.get("prenomMedecin")
    }));
  } finally {
    await session.close();
  }
};

//  Récupérer tous les rendez-vous d’un patient
const getRendezvousByPatient = async (patientId) => {
  const session = driver.session();

  try {
    const result = await session.run(`
  MATCH (p:Patient)-[:A_EU_RENDEZVOUS]->(r:RendezVous)<-[:AVEC_MEDECIN]-(m:Medecin)
  RETURN r.rdv_id AS id, r.date AS date, r.heure AS heure,
         p.nom AS nomPatient, p.prenom AS prenomPatient,
         m.nom AS nomMedecin, m.prenom AS prenomMedecin
`);

return result.records.map(record => ({
  id: record.get('id'),
  date: record.get('date'),
  heure: record.get('heure'),
  nomPatient: record.get('nomPatient'),
  prenomPatient: record.get('prenomPatient'),
  nomMedecin: record.get('nomMedecin'),
  prenomMedecin: record.get('prenomMedecin'),
}));

  } catch (err) {
    console.error("❌ Erreur lors de la récupération des rendez-vous :", err.message);
    throw err;
  } finally {
    await session.close();
  }
};
const deleteRendezvous = async (id) => {
  const session = driver.session();
  try {
    await session.run(`
      MATCH (r:RendezVous {id: $id})
      DETACH DELETE r
    `, { id });
    console.log("🗑️ Rendez-vous supprimé :", id);
  } catch (err) {
    console.error("❌ Erreur suppression rendez-vous :", err.message);
    throw err;
  } finally {
    await session.close();
  }
};

export default {
  createRendezvous,
  getAllRendezvous,
  getRendezvousByPatient,
  deleteRendezvous
};
