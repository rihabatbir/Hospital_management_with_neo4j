import express from 'express';
import driver from '../config/neo4j.js';

const router = express.Router();

router.get('/medecins-pathologies', async (req, res) => {
  const session = driver.session();
  const result = await session.run(`
    MATCH (m:Medecin)-[:POSE]->(d:Diagnostic)
    WHERE d.pathologie IS NOT NULL
    RETURN d.pathologie AS pathologie, m.nom AS medecin, COUNT(*) AS total
    ORDER BY total DESC
  `);
  res.json(result.records.map(r => ({
    pathologie: r.get("pathologie"),
    medecin: r.get("medecin"),
    total: r.get("total").low
  })));
});

router.get('/diagnostics-par-pathologie', async (req, res) => {
  const session = driver.session();
  const result = await session.run(`
    MATCH (d:Diagnostic)
    WHERE d.pathologie IS NOT NULL
    RETURN d.pathologie AS pathologie, COUNT(*) AS total
    ORDER BY total DESC
  `);
  res.json(result.records.map(r => ({
    pathologie: r.get("pathologie"),
    total: r.get("total").low
  })));
});

router.get('/traitements-populaires', async (req, res) => {
  const session = driver.session();
  const result = await session.run(`
    MATCH (d:Diagnostic)-[:PRESCRIT]->(t:Traitement)
    RETURN t.nom AS traitement, COUNT(*) AS total
    ORDER BY total DESC
  `);
  res.json(result.records.map(r => ({
    traitement: r.get("traitement"),
    total: r.get("total").low
  })));
});

export default router;
