import db from "../config/db.js";

const getAllBorrowings = (callback) => {
  let query = "SELECT * FROM borrowings";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const getBorrowingById = (id, callback) => {
  let query = "SELECT * FROM borrowings WHERE borrowing_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const getBorrowingsByQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM borrowings";
  let values = [];

  if (q) {
    sql += " WHERE STATUS LIKE ?";
    values.push(`%${q}%`);
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

const createBorrowing = (data, callback) => {
  let query = "INSERT INTO borrowings (user_id, borrow_date, return_date, STATUS) VALUES (?, ?, ?, ?)";
  let returnDate = data.return_date ? data.return_date : null;
  db.query(query, [data.user_id, data.borrow_date, returnDate, data.STATUS], (err, result) => {
    callback(err, result);
  });
};

const updateBorrowing = (id, data, callback) => {
  let query = "UPDATE borrowings SET return_date = ?, STATUS = ? WHERE borrowing_id = ?";
  let returnDate = data.return_date ? data.return_date : null;
  db.query(query, [returnDate, data.STATUS, id], (err, result) => {
    callback(err, result);
  });
};

const deleteBorrowing = (id, callback) => {
  let query = "DELETE FROM borrowings WHERE borrowing_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const deleteAllBorrowings = (callback) => {
  let query = "DELETE FROM borrowings";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

export default { getAllBorrowings, getBorrowingById, getBorrowingsByQuery, createBorrowing, updateBorrowing, deleteBorrowing, deleteAllBorrowings };