// public/js/staff_rendezvous.js

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/rendezvous", {
      credentials: "include"
    });
    const data = await res.json();

    const tbody = document.getElementById("rendezvous-list");
    tbody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">Aucun rendez-vous trouvé</td></tr>`;
      return;
    }

    data.forEach(rdv => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-2">${rdv.id}</td>
        <td class="p-2">${rdv.date}</td>
        <td class="p-2">${rdv.heure}</td>
        <td class="p-2">${rdv.patientNom || rdv.patientId}</td>
        <td class="p-2">${rdv.medecinNom || rdv.medecinId}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erreur chargement RDV (staff) :", err);
  }
});
