document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageDiv = document.getElementById("login-message");

  try {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("🎯 Rôle identifié :", data.role);
      if (data.role === "staff") {
        window.location.href = "/pages/staff/staff_index.html";
      } else if (data.role === "patient") {
        window.location.href = "/pages/patient/patient_index.html";
      } else {
        messageDiv.textContent = "Rôle inconnu : " + data.role;
        messageDiv.classList.remove("hidden");
      }
    } else {
      messageDiv.textContent = data.message || "Identifiants incorrects";
      messageDiv.classList.remove("hidden");
    }
  } catch (err) {
    console.error("❌ Erreur login :", err);
    messageDiv.textContent = "Erreur de connexion au serveur";
    messageDiv.classList.remove("hidden");
  }
});
