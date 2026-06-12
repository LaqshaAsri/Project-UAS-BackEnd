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

  let sql = "SELECT * FROM authors";
  let values = [];

  if (q) {
    sql += " WHERE author_name LIKE ?";
    values.push(`%${q}%`);
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  db.query(sql, values, (err, result) => {
    callback(err, result);
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