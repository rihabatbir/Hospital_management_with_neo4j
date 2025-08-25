import { saveMessage } from '../models/chatModel.js';

export const chat = async (req, res) => {
  const { message } = req.body;
  const user = req.session.user;

  if (!user) return res.status(401).json({ message: 'Non connecté' });

  try {
    await saveMessage({ email: user.email, texte: message, type: 'user' });

    // Simuler une réponse
    const botReply = "Je suis un assistant médical. Veuillez consulter un professionnel.";
    await saveMessage({ email: user.email, texte: botReply, type: 'bot' });

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Erreur chatbot:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
