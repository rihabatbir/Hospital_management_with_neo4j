// frontend/chatbot/chatbot.js

const questionsParService = {
  diagnostic: [
    "Quel est votre symptôme principal ?",
    "Depuis combien de temps l’éprouvez-vous ?",
    "Avez-vous déjà eu ce problème auparavant ?"
  ],
  rendezvous: [
    "Souhaitez-vous prendre rendez-vous avec un médecin ?",
    "Préférez-vous une date ou un créneau particulier ?",
    "Avez-vous une spécialité médicale en tête ?"
  ],
  urgence: [
    "Quel est le problème urgent ?",
    "Le patient est-il conscient ?",
    "Avez-vous besoin d’une ambulance ?"
  ]
};

const chatbotContainer = document.createElement('div');
chatbotContainer.className = 'chatbot-container fixed bottom-4 right-4 max-w-sm w-full z-50';
chatbotContainer.innerHTML = `
  <div class="chatbot bg-white border rounded-lg shadow-lg">
    <div class="chat-header bg-blue-600 text-white px-4 py-2 rounded-t-lg">💬 Chat Assistant</div>
    <div id="chatbox" class="chatbox p-4 h-64 overflow-y-auto text-sm"></div>
    <div class="chat-input p-2 border-t">
      <input id="chatInput" type="text" class="w-full px-2 py-1 border rounded" placeholder="Votre réponse...">
    </div>
  </div>
`;
document.body.appendChild(chatbotContainer);

let currentQuestion = 0;
let currentContext = 'diagnostic'; // peut être changé dynamiquement selon la page
const chatbox = document.getElementById('chatbox');
const input = document.getElementById('chatInput');

function afficherMessage(role, message) {
  const msg = document.createElement('div');
  msg.className = `my-1 ${role === 'user' ? 'text-right' : 'text-left'}`;
  msg.innerHTML = `<span class="inline-block px-3 py-1 rounded-lg ${role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}">${message}</span>`;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function poserQuestion() {
  const q = questionsParService[currentContext];
  if (currentQuestion < q.length) afficherMessage('bot', q[currentQuestion]);
  else afficherMessage('bot', "Merci pour vos réponses. Un agent vous contactera.");
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    afficherMessage('user', input.value);
    input.value = '';
    currentQuestion++;
    setTimeout(poserQuestion, 600);
  }
});

// Lancer le chat avec la première question
poserQuestion();
