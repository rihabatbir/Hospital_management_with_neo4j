import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import staffRoutes from './routes/staffRoutes.js';
dotenv.config();

// ✅ Initialiser express en premier !
const app = express();

// ✅ Importer ensuite les routes (après app)
import patientRoutes from './routes/patientRoutes.js';
import medecinRoutes from './routes/medecinRoutes.js';
import diagnosticRoutes from './routes/diagnosticRoutes.js';
import traitementRoutes from './routes/traitementRoutes.js';
import rendezvousRoutes from './routes/rendezvousRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import analyseRoutes from './routes/analyseRoutes.js';
import historiqueRoutes from './routes/hystoriqueRoutes.js';

// 🔁 Résolution des chemins pour le dossier static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend/pages')));

// ✅ Middlewares globaux
app.use(cors({
  origin: ['http://localhost:5500', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: 'motDePasseUltraSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600000
  }
}));

//  Définition des routes
app.use('/patients', patientRoutes);
app.use('/medecins', medecinRoutes);
app.use('/diagnostics', diagnosticRoutes);
app.use('/traitements', traitementRoutes);
app.use('/rendezvous', rendezvousRoutes);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/analyse', analyseRoutes);
app.use('/patient', historiqueRoutes); 


app.use('/staff', staffRoutes); 


// Test route
app.get('/', (req, res) => {
  res.send('API OK');
});

app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ connecté: true, user: req.session.user });
  } else {
    res.status(401).json({ connecté: false, message: 'Non connecté' });
  }
});

// Lancer serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
