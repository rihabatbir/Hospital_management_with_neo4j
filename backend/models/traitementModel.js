// backend/models/traitementModel.js
import driver from '../config/neo4j.js';

const getAllTraitements = async () => {
  const session = driver.session();
  try {
    console.log("🧠 Lancement de la requête MATCH ...");

    const result = await session.run(`
      MATCH (p:Patient)-[:A_RECU]->(t:Traitement)
      RETURN 
        t.traitement_id AS id,
        t.nom AS nom,
        t.duree AS duree,
        p.patient_id AS patientId,
        p.nom AS nomPatient,
        p.prenom AS prenomPatient
    `);

    return result.records.map(record => ({
      id: record.get("id"),
      nom: record.get("nom"),
      duree: record.get("duree"),
      patientId: record.get("patientId"),
      nomPatient: record.get("nomPatient"),
      prenomPatient: record.get("prenomPatient")
    }));
  } finally {
    await session.close();
  }
};



const createTraitement = async ({ id, nom, duree, patientId, medecinId }) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (p:Patient {patient_id: $patientId})
      MATCH (m:Medecin {medecin_id: $medecinId})
      CREATE (t:Traitement {
        traitement_id: $id,
        nom: $nom,
        duree: $duree
      })
      CREATE (p)-[:A_RECU]->(t)
      CREATE (m)-[:A_PRESCRIT]->(t)
      RETURN t
    `, { id, nom, duree, patientId, medecinId });

    console.log("✅ Traitement créé avec relations :", result.records);
  } catch (error) {
    console.error("❌ Erreur création traitement :", error);
    throw error;
  } finally {
    await session.close();
  }
};

const deleteTraitement = async (id) => {
  const session = driver.session();
  try {
    await session.run('MATCH (t:Traitement {traitement_id: $id}) DETACH DELETE t', { id });
  } finally {
    await session.close();
  }
};


export default {
  getAllTraitements,
  createTraitement,
  deleteTraitement 
};

