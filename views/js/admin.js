const API_BASE = "http://localhost:1140";

let totalData = 0;
let totalPages = 1;
let currentPage = 1;
let currentLimit = 2;
let currentSearch = "";

function setupUserInfo() {
  const role = localStorage.getItem("role");

  document.getElementById("userLabel").textContent = "Login sebagai: " + (role || "admin");
  document.getElementById("roleBadge").textContent = "ADMIN";
  document.getElementById("roleBadge").className = "role-badge role-admin";
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { "Content-Type": "application/json", Authorization: "Bearer " + token } : { "Content-Type": "application/json" };
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
}

function login() {
  window.location.href = "/";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/";
}

function setActiveNavbar() {
  const currentPath = window.location.pathname;

  document.querySelectorAll(".navbar a").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  totalPages = Math.ceil(totalData / currentLimit);

  pagination.innerHTML = `
          <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>Sebelumnya</button>
          <span>Halaman ${currentPage} dari ${totalPages || 1}</span>
          <button onclick="changePage(${currentPage + 1})" ${currentPage >= totalPages ? "disabled" : ""}>Selanjutnya</button>
        `;
}
