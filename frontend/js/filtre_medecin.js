document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("medecin-select");
  const serviceSpan = document.getElementById("service");
  const pathologiesList = document.getElementById("pathologies");
  const patientsTable = document.getElementById("patientsTableBody");

  try {
    const res = await fetch("http://localhost:3001/staff/all-medecins");
    const medecins = await res.json();

    medecins.forEach(m => {
      const option = document.createElement("option");
      option.value = m.nom_complet;
      option.textContent = m.nom_complet;
      select.appendChild(option);
    });

    if (medecins.length > 0) {
      await loadMedecinInfo(medecins[0].nom_complet);
    }

    select.addEventListener("change", async () => {
      await loadMedecinInfo(select.value);
    });
  } catch (error) {
    console.error("Erreur chargement médecins:", error);
  }
});

async function loadMedecinInfo(nom) {
  const serviceSpan = document.getElementById("service");
  const pathologiesList = document.getElementById("pathologies");
  const patientsTable = document.getElementById("patientsTableBody");

  try {
    const res = await fetch(`http://localhost:3001/staff/medecin-infos?nom=${encodeURIComponent(nom)}`);
    const data = await res.json();

    serviceSpan.textContent = data.service || '-';

    // Pathologies
    pathologiesList.innerHTML = '';
    data.pathologies?.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      pathologiesList.appendChild(li);
    });

    // Patients
    patientsTable.innerHTML = '';
    const uniqueSet = new Set();

    data.patients?.forEach(p => {
      const key = `${p.nom}|${p.prenom}|${p.email}|${p.traitement}|${p.pathologie}`;
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="border px-4 py-2">${p.nom || '-'}</td>
          <td class="border px-4 py-2">${p.prenom || '-'}</td>
          <td class="border px-4 py-2">${p.email || '-'}</td>
          <td class="border px-4 py-2">${p.traitement || '-'}</td>
          <td class="border px-4 py-2">${p.pathologie || '-'}</td>
        `;
        patientsTable.appendChild(tr);
      }
    });
  } catch (err) {
    console.error("Erreur infos médecin:", err);
  }
}
