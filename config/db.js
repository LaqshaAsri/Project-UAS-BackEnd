import mysql2 from "mysql2";

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "library_db",
});

db.connect((e) => {
  if (e) {
    console.log("Terjadi Error");
    return;
  }
  console.log("Koneksi database berhasil");
});

export default db;
