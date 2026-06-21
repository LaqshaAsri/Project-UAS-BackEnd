import dotenv from "dotenv";
dotenv.config();

import mysql2 from "mysql2";

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((e) => {
  if (e) {
    console.error("Kode Error:", e.code);
    console.error("Pesan:", e.message);
    return;
  }
  console.log("Koneksi database berhasil");
});

export default db;
