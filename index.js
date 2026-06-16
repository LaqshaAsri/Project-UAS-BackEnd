import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const hostname = "localhost";
const port = 1140;

import authRoutes from "./routes/authRoute.js";
import authorsRoute from "./routes/authorsRoute.js";
import booksRoute from "./routes/booksRoute.js";
import borrowingsRoute from "./routes/borrowingsRoute.js";
import categoriesRoute from "./routes/categoriesRoute.js";
import usersRoute from "./routes/usersRoute.js";

app.use(express.json());
app.use(express.static("views"));
app.use("/author", authorsRoute);
app.use("/books", booksRoute);
app.use("/borrow", borrowingsRoute);
app.use("/category", categoriesRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoutes);

// Halaman utama -> login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Halaman register.html
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/guest/books", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "guest.html"));
});

app.get("/member/books", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "member.html"));
});

app.get("/admin/:page", (req, res) => {
  const pages = {
    books: "adminBooks.html",
    author: "adminAuthors.html",
    category: "adminCategories.html",
    borrow: "adminBorrowings.html",
    users: "adminUsers.html",
  };
  const file = pages[req.params.page];

  if (!file) {
    return res.status(404).send("Page not found");
  }

  res.sendFile(path.join(__dirname, "views", file));
});

app.use(express.static(path.join(__dirname, "views")));

app.use("/author", authorsRoute);
app.use("/books", booksRoute);
app.use("/borrow", borrowingsRoute);
app.use("/category", categoriesRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});