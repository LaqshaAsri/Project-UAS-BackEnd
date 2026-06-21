import "dotenv/config";
import mysql2 from "mysql2";

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((e) => {
  if (e) {
    console.log("Terjadi Error:", e.message);
    return;
  }
  console.log("Koneksi database berhasil");
});

export default db;