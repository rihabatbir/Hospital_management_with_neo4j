const BASE_URL = "http://localhost:3001";

const message = document.getElementById("message");
const tableBody = document.getElementById("patient-table-body");
const form = document.getElementById("form-patient");

//  Ajouter un patient
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const patient_id = document.getElementById("patient_id").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const date_naissance = document.getElementById("date_naissance").value;

  try {
    const res = await fetch(`${BASE_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ patient_id, nom, prenom, date_naissance })
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = "✅ Patient ajouté avec succès !";
      message.classList.remove("text-red-600");
      message.classList.add("text-green-600");

      form.reset();
      chargerPatients();
    } else {
      message.textContent = "❌ " + (data.message || data.error || "Erreur lors de l'ajout");
      message.classList.remove("text-green-600");
      message.classList.add("text-red-600");
    }
  } catch (err) {
    message.textContent = "❌ Erreur de connexion au serveur";
    message.classList.remove("text-green-600");
    message.classList.add("text-red-600");
    console.error("Erreur ajout patient :", err);
  }
});

//  Charger les patients
async function chargerPatients() {
  try {
    const res = await fetch(`${BASE_URL}/patients`, { credentials: "include" });

    if (!res.ok) {
      message.textContent = `❌ Échec chargement patients (${res.status})`;
      message.classList.add("text-red-600");
      return;
    }

    const data = await res.json();
    tableBody.innerHTML = "";

    data.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${p.patient_id}</td>
        <td class="p-2">${p.nom}</td>
        <td class="p-2">${p.prenom}</td>
        <td class="p-2">${p.date_naissance || '-'}</td>
        <td class="p-2">
          <button onclick="supprimerPatient('${p.patient_id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
            Supprimer
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    message.textContent = "";
  } catch (err) {
    console.error("Erreur chargement patients :", err);
    message.textContent = "❌ Erreur de connexion au serveur";
    message.classList.add("text-red-600");
  }
}

//  Supprimer
async function supprimerPatient(patient_id) {
  if (!confirm("Supprimer ce patient ?")) return;

  try {
    const res = await fetch(`${BASE_URL}/patients/${patient_id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      chargerPatients();
    } else {
      alert("❌ Échec suppression");
    }
  } catch (err) {
    console.error("Erreur suppression :", err);
    alert("❌ Erreur réseau");
  }
}

// Afficher/masquer le formulaire
function ouvrirFormulaire() {
  const formDiv = document.getElementById("formulaire-ajout");
  formDiv.classList.toggle("hidden");
}

window.addEventListener("DOMContentLoaded", chargerPatients);
window.supprimerPatient = supprimerPatient;
window.ouvrirFormulaire = ouvrirFormulaire;
