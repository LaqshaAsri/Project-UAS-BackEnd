import db from "../config/db.js";

const getAllCategories = (callback) => {
  let query = "SELECT * FROM categories";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const getCategorybyId = (id, callback) => {
  let query = "SELECT * FROM categories WHERE category_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const getCategoriesbyQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let whereClause = "";
  let values = [];

  // Filter
  if (q) {
    whereClause = " WHERE category_name LIKE ?";
    values.push(`%${q}%`);
  }

  const countSql = `SELECT COUNT(*) AS total FROM categories ${whereClause}`;
  db.query(countSql, values, (err, countResult) => {
    if (err) return callback(err);

    const total = countResult[0].total;

    // Pagination
    let dataSql = `SELECT * FROM categories ${whereClause} LIMIT ? OFFSET ?`;

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

const createCategory = (data, callback) => {
  let query = `INSERT INTO categories (category_name) VALUES ("${data.category_name}")`;
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const cekCategoryByName = (name, callback) => {
  const query = "SELECT * FROM categories WHERE category_name = ?";
  db.query(query, [name], (err, result) => {
    callback(err, result);
  });
};

const updateCategory = (id, data, callback) => {
  let query = `UPDATE categories SET category_name = "${data.category_name}" WHERE category_id = ` + id;
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const deleteCategorybyId = (id, callback) => {
  let query = "DELETE FROM categories WHERE category_id = " + id;
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const deleteAllCategories = (callback) => {
  let query = "DELETE FROM categories";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

export default { getAllCategories, getCategorybyId, getCategoriesbyQuery, createCategory, cekCategoryByName, updateCategory, deleteCategorybyId, deleteAllCategories };
