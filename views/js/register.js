const API_BASE = "http://localhost:1140";

async function register() {
  const user_name = document.getElementById("user_name").value.trim();
  const user_email = document.getElementById("user_email").value.trim();
  const user_password = document.getElementById("user_password").value;
  const user_phone = document.getElementById("user_phone").value.trim();
  const user_address = document.getElementById("user_address").value.trim();

  const errorMsg = document.getElementById("errorMsg");
  const successMsg = document.getElementById("successMsg");
  errorMsg.style.display = "none";
  successMsg.style.display = "none";

  // Validasi di sisi client
  if (!user_name || !user_email || !user_password) {
    errorMsg.textContent = "Nama, email, dan password wajib diisi";
    errorMsg.style.display = "block";
    return;
  }

  if (user_password.length < 6) {
    errorMsg.textContent = "Password minimal 6 karakter";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const res = await fetch(API_BASE + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name,
        user_email,
        user_password,
        user_phone,
        user_address,
        role: "user", // register selalu jadi member
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || "Gagal mendaftar";
      errorMsg.style.display = "block";
      return;
    }

    // Berhasil
    successMsg.textContent = "Daftar berhasil! Mengarahkan ke halaman login...";
    successMsg.style.display = "block";

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Tidak bisa terhubung ke server";
    errorMsg.style.display = "block";
  }
}
