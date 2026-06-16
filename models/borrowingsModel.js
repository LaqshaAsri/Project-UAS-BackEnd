import db from "../config/db.js";

const getAllBorrowings = (callback) => {
  const query = `
    SELECT
      b.borrowing_id,
      b.user_id,
      u.user_name,
      b.book_id,
      bk.title AS book_title,
      b.borrow_date,
      b.return_date,
      b.STATUS,
      b.created_at,
      b.created_by,
      b.updated_at,
      b.updated_by
    FROM borrowings b
    LEFT JOIN users u ON b.user_id = u.user_id
    LEFT JOIN books bk ON b.book_id = bk.book_id
  `;

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

// Fungsi pencarian khusus untuk member (mengecek buku apa saja yang dipinjam oleh user tertentu)
const getActiveBorrowingByMember = (userId, bookId, callback) => {
  let query = "SELECT * FROM borrowings WHERE user_id = ? AND book_id = ? AND STATUS = 'dipinjam' LIMIT 1";
  db.query(query, [userId, bookId], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0] || null);
  });
};

const getBorrowingsByQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;
  let whereClause = "";
  let values = [];

  if (q) {
    whereClause = `WHERE u.user_name LIKE ? OR bk.title LIKE ? OR b.STATUS LIKE ?`;
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM borrowings b
    LEFT JOIN users u ON b.user_id = u.user_id
    LEFT JOIN books bk ON b.book_id = bk.book_id
    ${whereClause}
  `;

  db.query(countSql, values, (err, countResult) => {
    if (err) return callback(err);

    const total = countResult[0].total;

    const dataSql = `
      SELECT
        b.borrowing_id,
        b.user_id,
        u.user_name,
        b.book_id,
        bk.title AS book_title,
        b.borrow_date,
        b.return_date,
        b.STATUS,
        b.created_at,
        b.created_by,
        b.updated_at,
        b.updated_by
      FROM borrowings b
      LEFT JOIN users u ON b.user_id = u.user_id
      LEFT JOIN books bk ON b.book_id = bk.book_id
      ${whereClause}
      ORDER BY b.borrowing_id DESC
      LIMIT ? OFFSET ?
    `;

    const dataValues = [...values, parseInt(limit), parseInt(offset)];

    db.query(dataSql, dataValues, (err, result) => {
      if (err) return callback(err);
      callback(null, { total, data: result });
    });
  });
};

const createBorrowing = (data, callback) => {
  let query = "INSERT INTO borrowings (user_id, borrow_date, return_date, STATUS, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)";
  let returnDate = data.return_date ? data.return_date : null;
  db.query(query, [data.user_id, data.borrow_date, returnDate, data.STATUS, data.created_by, data.updated_by], (err, result) => {
    callback(err, result);
  });
};

const updateBorrowing = (id, data, callback) => {
  let query = "UPDATE borrowings SET return_date = ?, STATUS = ?, updated_by = ? WHERE borrowing_id = ?";
  let returnDate = data.return_date ? data.return_date : null;
  db.query(query, [returnDate, data.STATUS, data.updated_by, id], (err, result) => {
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
