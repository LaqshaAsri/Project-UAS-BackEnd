import db from "../config/db.js";

const getAllAuthors = (callback) => {
  let query = "SELECT * FROM authors";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const getAuthorById = (id, callback) => {
  let query = "SELECT * FROM authors WHERE author_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const getAuthorsByQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let whereClause = "";
  let values = [];

  if (q) {
    whereClause = `WHERE author_name LIKE ? OR author_country LIKE ?`;
    values.push(`%${q}%`);
    values.push(`%${q}%`);
  }

  const countSql = `SELECT COUNT(*) AS total FROM authors ${whereClause}`;

  db.query(countSql, values, (err, countResult) => {
    if (err) return callback(err);

    const total = countResult[0].total;

    let dataSql = `SELECT * FROM authors ${whereClause} LIMIT ? OFFSET ?`;

    let dataValues = [...values];
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

const createAuthor = (data, callback) => {
  let query = "INSERT INTO authors SET ?";
  db.query(query, data, (err, result) => {
    callback(err, result);
  });
};

const updateAuthor = (id, data, callback) => {
  let query = "UPDATE authors SET ? WHERE author_id = ?";
  db.query(query, [data, id], (err, result) => {
    callback(err, result);
  });
};

const deleteAuthor = (id, callback) => {
  let query = "DELETE FROM authors WHERE author_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const deleteAllAuthors = (callback) => {
  let query = "DELETE FROM authors";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

export default { getAllAuthors, getAuthorById, getAuthorsByQuery, createAuthor, updateAuthor, deleteAuthor, deleteAllAuthors };