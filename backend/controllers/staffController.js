import driver from '../config/neo4j.js';

export async function getMedecinInfos(req, res) {
  const { nom } = req.query;
  const session = driver.session();

  const query = `
    MATCH (m:Medecin)
    WHERE m.prenom + ' ' + m.nom = $nom

    OPTIONAL MATCH (m)-[:TRAVAILLE_DANS]->(s:Service)
    OPTIONAL MATCH (m)-[:POSE]->(d:Diagnostic)
    OPTIONAL MATCH (d)-[:TRAITE_PAR]->(t:Traitement)
    OPTIONAL MATCH (d)<-[:A_RECU]-(p:Patient)

    RETURN 
      s.nom AS service, 
      collect(DISTINCT t.pathologie) AS pathologies,
      collect(DISTINCT {
        nom: p.nom, 
        prenom: p.prenom, 
        email: p.email,
        traitement: t.nom,
        pathologie: t.pathologie
      }) AS patients
  `;

  try {
    const result = await session.run(query, { nom });
    const record = result.records[0];

    if (!record) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    // Nettoyage : on enlève les "patients" où les données sont vides
    let patients = record.get('patients') || [];
    patients = patients.filter(p => p.nom || p.prenom || p.email);

    res.json({
      service: record.get('service'),
      pathologies: record.get('pathologies'),
      patients: patients
    });
  } catch (error) {
    console.error("Erreur backend filtre médecin:", error);
    res.status(500).json({ message: "Erreur serveur" });
  } finally {
    await session.close();
  }
}

export async function getAllMedecins(req, res) {
  const session = driver.session();

  const query = `
    MATCH (m:Medecin)
    RETURN m.prenom AS prenom, m.nom AS nom
  `;

  try {
    const result = await session.run(query);
    const medecins = result.records.map(record => ({
      nom_complet: `${record.get('prenom')} ${record.get('nom')}`
    }));
    res.json(medecins);
  } catch (err) {
    console.error('Erreur getAllMedecins:', err);
    res.status(500).json({ message: "Erreur serveur" });
  } finally {
    await session.close();
  }
}
