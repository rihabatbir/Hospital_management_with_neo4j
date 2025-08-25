import driver from '../config/neo4j.js';

const getAllMedecins = async () => {
  const session = driver.session();
  try {
   const result = await session.run('MATCH (m:Medecin) RETURN m');
   return result.records.map(record => record.get('m').properties);

  } finally {
    await session.close();
  }
};

const createMedecin = async (medecin) => {
  const session = driver.session();
  const { medecin_id, nom, prenom, specialite } = medecin;

  try {
   await session.run(
  `
  MERGE (m:Medecin {medecin_id: $medecin_id})
  SET m.nom = $nom, m.prenom = $prenom, m.specialite = $specialite
  `,
  { medecin_id, nom, prenom, specialite }
);

    console.log("✅ Médecin inséré :", medecin_id);
  } catch (err) {
    console.error("❌ Erreur insertion médecin :", err);
    throw err;
  } finally {
    await session.close();
  }
};

const deleteMedecin = async (medecin_id) => {
  const session = driver.session();
  try {
    await session.run(
      'MATCH (m:Medecin {medecin_id: $medecin_id}) DETACH DELETE m',
      { medecin_id }
    );
    console.log("🗑️ Médecin supprimé :", medecin_id);
  } catch (err) {
    console.error("❌ Erreur suppression médecin :", err);
    throw err;
  } finally {
    await session.close();
  }
};

export default {
  getAllMedecins,
  createMedecin,
  deleteMedecin
};