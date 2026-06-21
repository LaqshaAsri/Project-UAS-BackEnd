const role = localStorage.getItem("role");
const path = window.location.pathname;

if (role === "admin" && (path === "/member/books" || path === "/guest/books")) {
  window.location.href = "/admin/books";
}

if (role === "user" && (path === "/admin/books" || path === "/admin/author" || path === "/admin/category" || path === "/admin/users" || path === "/admin/borrow" || path === "/guest/books")) {
  window.location.href = "/member/books";
}

if ((!role || role === "guest") && (path === "/admin/books" || path === "/admin/author" || path === "/admin/category" || path === "/admin/users" || path === "/admin/borrow" || path === "/member/books")) {
  window.location.href = "/guest/books";
}

const API_BASE = "http://localhost:1140";

let totalData = 0;
let totalPages = 1;
let currentPage = 1;
let currentLimit = 5;
let currentSearch = "";

function setupUserInfo() {
  const username = localStorage.getItem("user_name");
  const role = localStorage.getItem("role");

  const userLabel = document.getElementById("userLabel");
  const roleBadge = document.getElementById("roleBadge");

  if (!userLabel) return;

  if (role === "admin") {
    userLabel.textContent = "Login sebagai: " + username;

    if (roleBadge) {
      roleBadge.textContent = "ADMIN";
      roleBadge.className = "role-badge role-admin";
    }
  } else if (role === "user") {
    userLabel.textContent = "Login sebagai: " + username;

    if (roleBadge) {
      roleBadge.textContent = "Member";
      roleBadge.className = "role-badge role-admin";
    }
  } else {
    userLabel.textContent = "Login sebagai: Guest";

    if (roleBadge) {
      roleBadge.textContent = "GUEST";
      roleBadge.className = "role-badge role-guest";
    }
  }
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
  localStorage.removeItem("user_name");
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

function changeLimit() {
  const input = document.getElementById("limitInput");

  const value = parseInt(input.value);

  if (isNaN(value) || value < 1) {
    alert("Jumlah data harus lebih dari 0");
    return;
  }

  currentLimit = value;
  currentPage = 1;

  if (typeof loadBooks === "function") {
    loadBooks(currentPage, currentSearch);
  } else if (typeof loadAuthors === "function") {
    loadAuthors(currentPage, currentSearch);
  } else if (typeof loadCategories === "function") {
    loadCategories(currentPage, currentSearch);
  } else if (typeof loadBorrowings === "function") {
    loadBorrowings(currentPage, currentSearch);
  } else if (typeof loadUsers === "function") {
    loadUsers(currentPage, currentSearch);
  }
}

document.getElementById("limitInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    changeLimit();
  }
});

function renderPagination() {
  const pagination = document.getElementById("pagination");
  totalPages = Math.ceil(totalData / currentLimit);

  pagination.innerHTML = `
          <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>Sebelumnya</button>
          <span>Halaman ${currentPage} dari ${totalPages || 1}</span>
          <button onclick="changePage(${currentPage + 1})" ${currentPage >= totalPages ? "disabled" : ""}>Selanjutnya</button>
        `;
}
