document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  console.log("📤 Données envoyées :", { email, password, role });

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Inscription réussie !");
      window.location.href = "/pages/login.html";
    } else {
      alert("❌ Erreur : " + data.message);
    }
  } catch (err) {
    console.error("❗ Erreur inscription :", err);
    alert("Erreur côté client.");
  }
});
