import bcrypt from 'bcrypt';
import driver from '../config/neo4j.js';

// Enregistrer un nouvel utilisateur
export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const session = driver.session();

  try {
    const existing = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (existing.records.length > 0) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    await session.run(
      'CREATE (u:User {email: $email, password: $password, role: $role})',
      { email, password: hashedPassword, role }
    );

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    await session.close();
  }
};

//  Connexion
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const session = driver.session();

  try {
    const result = await session.run(`
  MATCH (u:User {email: $email})
  OPTIONAL MATCH (u)-[:REPRESENTE]->(p:Patient)
  OPTIONAL MATCH (u)-[:EST]->(m:Medecin)
  RETURN u, p, m
`, { email });

const user = result.records[0].get("u").properties;
const patient = result.records[0].get("p")?.properties;
const medecin = result.records[0].get("m")?.properties;

req.session.user = {
  email: user.email,
  role: user.role,
  ...(patient ? { patient_id: patient.patient_id } : {}),
  ...(medecin ? { medecin_id: medecin.medecin_id } : {})
};


    res.json({ message: 'Connecté avec succès', role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    await session.close();
  }
};

// Déconnexion
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Déconnecté' });
  });
};

// Récupérer les infos utilisateur connecté
export const getUserInfo = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }
  res.json({ user: req.session.user });
};

// Retourne l'utilisateur en session (pour /auth/session)
export const getSessionUser = (req, res) => {
  if (req.session.user) {
    res.json(req.session.user); // { email, role }
  } else {
    res.status(401).json({ message: "Non connecté" });
  }
};
