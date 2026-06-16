import db from "../config/db.js";

const getAllBorrowings = (callback) => {
  const query = `
    SELECT
      b.borrowing_id,
      b.user_id,
      u.user_name,
      b.borrow_date,
      b.return_date,
      b.STATUS,
      b.created_at,
      b.created_by,
      b.updated_at,
      b.updated_by
    FROM borrowings b
    LEFT JOIN users u
      ON b.user_id = u.user_id
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

const getBorrowingsByQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let whereClause = "";
  let values = [];

  if (q) {
    whereClause = `WHERE u.user_name LIKE ? OR b.STATUS LIKE ? OR b.borrow_date LIKE ? OR b.return_date LIKE ?`;
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM borrowings b
    LEFT JOIN users u
      ON b.user_id = u.user_id
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
        b.borrow_date,
        b.return_date,
        b.STATUS,
        b.created_at,
        b.created_by,
        b.updated_at,
        b.updated_by
      FROM borrowings b
      LEFT JOIN users u
        ON b.user_id = u.user_id
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    const dataValues = [...values];
    dataValues.push(parseInt(limit));
    dataValues.push(parseInt(offset));

    db.query(dataSql, dataValues, (err, result) => {
      if (err) return callback(err);

      callback(null, {
        total,
        data: result,
      });
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