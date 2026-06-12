import express from "express";
const app = express();
const hostname = "127.0.0.1";
const port = 1140;

import authorsRoute from "./routes/authorsRoute.js";
import booksRoute from "./routes/booksRoute.js";
import borrowingsRoute from "./routes/borrowingsRoute.js";
import categoriesRoute from "./routes/categoriesRoute.js";
import usersRoute from "./routes/usersRoute.js";

app.use(express.json());
app.use("/author", authorsRoute);
app.use("/books", booksRoute);
app.use("/borrow", borrowingsRoute);
app.use("/category", categoriesRoute);
app.use("/users", usersRoute);

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});
