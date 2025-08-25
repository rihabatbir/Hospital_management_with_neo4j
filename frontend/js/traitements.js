//  Charger tous les traitements liés à un patient
async function chargerTraitements() {
  const traitementTable = document.getElementById('traitement-list');
  traitementTable.innerHTML = ""; // Nettoyage

  try {
    const res = await fetch("http://localhost:3001/traitements", {
      credentials: "include"
    });

    const data = await res.json();
    console.log("📦 Traitements reçus :", data);

    if (!Array.isArray(data) || data.length === 0) {
      traitementTable.innerHTML = `
        <tr><td colspan="4" class="p-4 text-center text-gray-500">Aucun traitement trouvé.</td></tr>
      `;
      return;
    }

    data.forEach(t => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${t.id}</td>
        <td class="p-2">${t.nom}</td>
        <td class="p-2">${t.duree}</td>
        <td class="p-2">${t.prenomPatient} ${t.nomPatient} (ID: ${t.patientId})</td>
      `;
      traitementTable.appendChild(row);
    });

  } catch (err) {
    console.error("❌ Erreur affichage traitements :", err);
    traitementTable.innerHTML = `
      <tr><td colspan="4" class="p-4 text-red-600">Erreur lors du chargement des traitements.</td></tr>
    `;
  }
}

// Ajouter un traitement avec lien vers patient + médecin
document.getElementById('form-traitement').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    id: document.getElementById('traitement-id').value,
    nom: document.getElementById('traitement-nom').value,
    duree: document.getElementById('traitement-duree').value,
    patientId: document.getElementById('patient-id').value,
    medecinId: document.getElementById('medecin-id').value
  };

  try {
    const res = await fetch("http://localhost:3001/traitements", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert("✅ Traitement ajouté !");
      document.getElementById('form-traitement').reset();
      chargerTraitements(); // 🔁 Recharge la liste
    } else {
      alert("❌ Erreur : " + (result.error || "Impossible d'ajouter."));
    }
  } catch (err) {
    console.error("⛔ Erreur réseau :", err);
    alert("Erreur de connexion");
  }
});

// Charger les traitements dès l’ouverture de la page
window.addEventListener("DOMContentLoaded", chargerTraitements);
