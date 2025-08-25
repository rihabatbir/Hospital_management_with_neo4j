async function chargerRendezvous() {
  const table = document.getElementById("rendezvous-list");
  table.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3001/rendezvous", {
      credentials: "include"
    });

    const data = await res.json();
    console.log("📦 Rendez-vous chargés :", data);

    if (!Array.isArray(data) || data.length === 0) {
      table.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-gray-500">Aucun rendez-vous trouvé.</td></tr>`;
      return;
    }

    data.forEach(rdv => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${rdv.id}</td> 
        <td class="p-2">${rdv.date}</td>
        <td class="p-2">${rdv.heure}</td>
        <td class="p-2">${rdv.prenomPatient} ${rdv.nomPatient} (ID: ${rdv.patientId})</td>
        <td class="p-2">${rdv.prenomMedecin} ${rdv.nomMedecin} (ID: ${rdv.medecinId})</td>
<td class="p-2">
  <button onclick="supprimerRendezvous('${rdv.id}')" class="text-red-600 hover:underline">🗑️ Supprimer </button>
</td>

      `;
      table.appendChild(row);
    });

  } catch (err) {
    console.error("❌ Erreur chargement rendez-vous :", err);
    table.innerHTML = `<tr><td colspan="5" class="text-red-600 p-4">Erreur lors du chargement des rendez-vous.</td></tr>`;
  }
}

window.addEventListener("DOMContentLoaded", chargerRendezvous);
document.getElementById('form-rendezvous').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    id: document.getElementById('rdv-id').value,
    date: document.getElementById('rdv-date').value,
    heure: document.getElementById('rdv-heure').value,
    patientId: document.getElementById('rdv-patient').value,
    medecinId: document.getElementById('rdv-medecin').value
  };

  try {
    const res = await fetch("http://localhost:3001/rendezvous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert("✅ Rendez-vous ajouté !");
      document.getElementById('form-rendezvous').reset();
      chargerRendezvous(); // 🔁 recharge la liste
    } else {
      alert("❌ Erreur : " + (result.error || result.message));
    }

  } catch (err) {
    console.error("⛔ Erreur réseau :", err);
    alert("Erreur réseau lors de l'ajout.");
  }
});
//  Fonction de suppression
async function supprimerRendezvous(id) {
  if (!confirm("❓ Supprimer ce rendez-vous ?")) return;

  try {
    const res = await fetch(`http://localhost:3001/rendezvous/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      alert("🗑️ Rendez-vous supprimé !");
      chargerRendezvous(); // 🔁 recharge la liste
    } else {
      alert("❌ Erreur : suppression échouée");
    }

  } catch (err) {
    console.error("⛔ Erreur suppression :", err);
    alert("Erreur réseau lors de la suppression.");
  }
}

//  Rendez globale pour usage dans le bouton HTML
window.supprimerRendezvous = supprimerRendezvous;
