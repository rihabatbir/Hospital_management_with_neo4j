// frontend/js/diagnostic.js
const diagnosticTable = document.getElementById('diagnostic-list');

fetch('http://localhost:3000/diagnostics')
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) return;
    data.forEach(item => {
      const { diagnostic, patient, medecin, traitement } = item;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${diagnostic.id}</td>
        <td class="p-2">${diagnostic.description}</td>
        <td class="p-2">${patient.prenom} ${patient.nom}</td>
        <td class="p-2">${medecin.prenom} ${medecin.nom}</td>
        <td class="p-2">${traitement.nom}</td>
      `;
      diagnosticTable.appendChild(row);
    });
  })
  .catch(err => console.error('Erreur chargement diagnostics:', err));
