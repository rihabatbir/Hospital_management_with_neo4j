// Fonction d'ajout d'un médecin
document.getElementById("form-medecin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const tableBody = document.getElementById("medecin-table-body");


  const medecin_id = document.getElementById("id").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const specialite = document.getElementById("specialite").value.trim();
  const message = document.getElementById("message");

  try {
    const res = await fetch("http://localhost:3001/medecins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Pour les cookies de session
      body: JSON.stringify({ medecin_id, nom, prenom, specialite })
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = "✅ Médecin ajouté avec succès !";
      message.classList.remove("text-red-600");
      message.classList.add("text-green-600");

      // Réinitialise les champs
      document.getElementById("form-medecin").reset();

      // Recharge la liste
      chargerMedecins();
    } else {
      message.textContent = "❌ Erreur : " + (data.message || data.error || "Échec lors de l'ajout.");
      message.classList.remove("text-green-600");
      message.classList.add("text-red-600");
    }
  } catch (err) {
    message.textContent = "❌ Erreur de connexion au serveur.";
    message.classList.remove("text-green-600");
    message.classList.add("text-red-600");
    console.error("Erreur réseau :", err);
  }
});

// Fonction de chargement des médecins
async function chargerMedecins() {
  const message = document.getElementById("message");
  const tableBody = document.getElementById("medecin-table-body");

  try {
    const res = await fetch("http://localhost:3001/medecins", {
      credentials: "include"
    });

    if (!res.ok) {
      message.textContent = "❌ Échec de chargement des médecins. Statut: " + res.status;
      message.classList.remove("text-green-600");
      message.classList.add("text-red-600");
      return;
    }

    const data = await res.json();
    tableBody.innerHTML = "";

    data.forEach((m) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${m.medecin_id}</td>
        <td class="p-2">${m.nom}</td>
        <td class="p-2">${m.prenom}</td>
        <td class="p-2">${m.specialite || '-'}</td>
        <td class="p-2">
          <button onclick="supprimerMedecin('${m.medecin_id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
            Supprimer
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    message.textContent = ""; 
  } catch (err) {
    message.textContent = "❌ Erreur de connexion au serveur.";
    message.classList.remove("text-green-600");
    message.classList.add("text-red-600");
    console.error("Erreur chargement médecins:", err);
  }
}

// Fonction de suppression
async function supprimerMedecin(medecin_id) {
  if (!confirm("Supprimer ce médecin ?")) return;

  try {
    const res = await fetch(`http://localhost:3001/medecins/${medecin_id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      chargerMedecins(); // recharge la liste après suppression
    } else {
      alert("❌ Échec suppression");
    }
  } catch (err) {
    console.error("Erreur suppression:", err);
    alert("❌ Erreur réseau");
  }
}


// Affiche/masque le formulaire d’ajout
function ouvrirFormulaire() {
  const formDiv = document.getElementById("formulaire-ajout");
  formDiv.classList.toggle("hidden");
}

// Chargement initial
window.addEventListener("DOMContentLoaded", chargerMedecins);

// Rend disponible la fonction au global
window.supprimerMedecin = supprimerMedecin;
window.ouvrirFormulaire = ouvrirFormulaire;
