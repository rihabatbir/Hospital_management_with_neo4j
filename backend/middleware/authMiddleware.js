// Vérifie si l'utilisateur est connecté
export const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non authentifié' });
  }
  next();
};

// Vérifie si l'utilisateur a le rôle requis (ex: 'staff' ou 'patient')
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};

// backend/middleware/authMiddleware.js
export function requireAuth(req, res, next) {
  if (req.session?.user) {
    return next();
  } else {
    return res.status(401).json({ message: "Non connecté" });
  }
}

