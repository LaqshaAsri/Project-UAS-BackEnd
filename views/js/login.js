const API_BASE = "http://localhost:1140";

async function loginAs(expectedRole) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.style.display = "none";

  if (!email || !password) {
    errorMsg.textContent = "Email dan password wajib diisi";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const res = await fetch(API_BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || "Login gagal";
      errorMsg.style.display = "block";
      return;
    }

    // 'member' di tombol disesuaikan ke 'user' di DB

    const roleMap = { admin: "admin", member: "user" };
    if (data.role !== expectedRole) {
      errorMsg.textContent = `Akun ini bukan ${expectedRole === "admin" ? "Admin" : "Member"}`;
      errorMsg.style.display = "block";
      return; // ← ini yang kurang, supaya berhenti dan tidak redirect
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user_name", data.user.user_name);

    // Arahkan sesuai role
    if (data.role === "admin") {
      window.location.href = "/admin/books";
    } else if (data.role === "user") {
      window.location.href = "/member/books";
    } else {
      window.location.href = "/guest/books";
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Tidak bisa terhubung ke server";
    errorMsg.style.display = "block";
  }
}

function guest() {
  localStorage.clear();
  localStorage.setItem("role", "guest");
  window.location.href = "/guest/books";
}
