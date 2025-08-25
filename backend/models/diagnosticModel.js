// backend/models/diagnosticModel.js
import driver from '../config/neo4j.js';

const getAllDiagnostics = async () => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (d:Diagnostic)-[:CONCERNE]->(p:Patient), (d)<-[:POSE]-(m:Medecin), (d)-[:NECESSITE]->(t:Traitement)
      RETURN d, p, m, t
    `);
    return result.records.map(record => ({
      diagnostic: record.get('d').properties,
      patient: record.get('p').properties,
      medecin: record.get('m').properties,
      traitement: record.get('t').properties,
    }));
  } finally {
    await session.close();
  }
};

const createDiagnostic = async ({ id, description, patientId, medecinId, traitementId }) => {
  const session = driver.session();
  try {
    await session.writeTransaction(tx =>
      tx.run(`
        MATCH (p:Patient {id: $patientId}), (m:Medecin {id: $medecinId}), (t:Traitement {id: $traitementId})
        CREATE (d:Diagnostic {id: $id, description: $description})
        CREATE (d)-[:CONCERNE]->(p)
        CREATE (m)-[:POSE]->(d)
        CREATE (d)-[:NECESSITE]->(t)
      `, { id, description, patientId, medecinId, traitementId })
    );
  } finally {
    await session.close();
  }
};

export default {
  getAllDiagnostics,
  createDiagnostic
};
