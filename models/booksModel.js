import db from "../config/db.js";

const getAllBooks = (callback) => {
  let query = "SELECT * FROM books";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const getBookbyId = (id, callback) => {
  let query = "SELECT * FROM books WHERE book_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const getBookbyQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM books";
  let values = [];
  //-----filter---------//
  if (q) {
    sql += " WHERE title LIKE ?";
    values.push(`%${q}%`);
  }
  //-----pagination---------//
  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};
//-----------------------method ------------------------//
// add - update - delete //

const addBook = (book, callback) => {
  let query = `
    INSERT INTO books (title, author_id, category_id, published_year, stock)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [book.title, book.author_id, book.category_id, book.published_year, book.stock];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

const updateBook = (book, callback) => {
  let query = "UPDATE books SET ? WHERE book_id = ?";
  db.query(query, [book, book.book_id], (err, result) => {
    callback(err, result);
  });
};

const deleteBook = (id, callback) => {
  let query = "DELETE FROM books WHERE book_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const deleteAllBooks = (callback) => {
  let query = "DELETE FROM books";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

export default {
  getAllBooks,
  getBookbyId,
  getBookbyQuery,
  addBook,
  updateBook,
  deleteBook,
  deleteAllBooks,
};
