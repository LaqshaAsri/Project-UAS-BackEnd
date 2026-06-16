import db from "../config/db.js";

const getAllBooks = (callback) => {
  let query = `
    SELECT
      b.book_id,
      b.title,
      b.author_id,
      a.author_name,
      b.category_id,
      c.category_name,
      b.published_year,
      b.stock,
      b.created_at,
      b.created_by,
      b.updated_at,
      b.updated_by
    FROM books b
    LEFT JOIN authors a
      ON b.author_id = a.author_id
    LEFT JOIN categories c
      ON b.category_id = c.category_id
  `;

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

  let whereClause = "";
  let values = [];
  if (q) {
    whereClause = `WHERE b.title LIKE ? OR a.author_name LIKE ? OR c.category_name LIKE ? OR b.published_year LIKE ? OR b.stock LIKE ?`;
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
  }

  const countSql = `
    SELECT COUNT(*) AS total 
    FROM books b
    LEFT JOIN authors a
      ON b.author_id = a.author_id
    LEFT JOIN categories c
      ON b.category_id = c.category_id
    ${whereClause}`;

  db.query(countSql, values, (err, countResult) => {
    if (err) return callback(err);

    const total = countResult[0].total;

    let dataSql = `
      SELECT
        b.book_id,
        b.title,
        b.author_id,
        a.author_name,
        b.category_id,
        c.category_name,
        b.published_year,
        b.stock,
        b.created_at,
        b.created_by,
        b.updated_at,
        b.updated_by
      FROM books b
      LEFT JOIN authors a
        ON b.author_id = a.author_id
      LEFT JOIN categories c
        ON b.category_id = c.category_id
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

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

const addBook = (book, callback) => {
  let query = `
    INSERT INTO books (title, author_id, category_id, published_year, stock, created_by, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    book.title,
    book.author_id,
    book.category_id,
    book.published_year,
    book.stock,
    book.created_by,
    book.updated_by,
  ];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

const updateBook = (book, callback) => {
  const { book_id, ...dataToUpdate } = book;
  let query = "UPDATE books SET ? WHERE book_id = ?";
  db.query(query, [dataToUpdate, book_id], (err, result) => {
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