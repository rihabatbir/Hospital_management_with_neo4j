// backend/models/hystoriqueModel.js
import driver from '../config/neo4j.js';

export async function fetchHistoriqueMedical(email) {
  const session = driver.session();

  const query = `
    MATCH (u:User {email: $email})-[:REPRESENTE]->(p:Patient)
    OPTIONAL MATCH (p)<-[:A_POUR_PATIENT]-(r:RendezVous)-[:A_POUR_MEDECIN]->(m:Medecin)
    OPTIONAL MATCH (m)-[:POSE]->(d:Diagnostic)
    OPTIONAL MATCH (d)-[:TRAITE_PAR]->(t:Traitement)
    OPTIONAL MATCH (m)-[:TRAVAILLE_DANS]->(s:Service)
    RETURN r.date AS date, r.heure AS heure,
           m.nom AS medecin, m.specialite AS specialite,
           s.nom AS service,
           d.pathologie AS diagnostic,
           t.nom AS traitement
    ORDER BY r.date DESC
  `;

  try {
    const result = await session.run(query, { email });
    return result.records.map(record => ({
      date: record.get('date') || '—',
      heure: record.get('heure') || '—',
      medecin: record.get('medecin') || '—',
      specialite: record.get('specialite') || '—',
      service: record.get('service') || '—',
      diagnostic: record.get('diagnostic') || '—',
      traitement: record.get('traitement') || '—'
    }));
  } catch (error) {
    console.error('Erreur Neo4j:', error);
    return [];
  } finally {
    await session.close();
  }
}
