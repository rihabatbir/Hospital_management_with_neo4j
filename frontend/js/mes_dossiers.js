// frontend/pages/patient/mes_dossiers.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3001/patient/historique", {
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) throw new Error("Échec requête");
      return res.json();
    })
    .then(data => {
      const tbody = document.querySelector("#historiqueBody");
      if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="7">Aucun historique trouvé</td></tr>';
        return;
      }

      tbody.innerHTML = data.map(item => `
        <tr>
          <td>${item.date}</td>
          <td>${item.heure}</td>
          <td>${item.medecin}</td>
          <td>${item.specialite}</td>
          <td>${item.service}</td>
          <td>${item.diagnostic}</td>
          <td>${item.traitement}</td>
        </tr>
      `).join('');
    })
    .catch(err => {
      const container = document.querySelector(".container");
      container.innerHTML = `<div class="alert alert-danger">Erreur de chargement : ${err.message}</div>`;
    });
});
