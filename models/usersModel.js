import db from "../config/db.js";

const getAllUsers = (callback) => {
  let query = "SELECT * FROM users";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const getUserById = (id, callback) => {
  let query = "SELECT * FROM users WHERE user_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

export const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE user_email = ?";
  db.query(query, [email], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result[0]);
  });
};

const getUsersByQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let whereClause = "";
  let values = [];

  if (q) {
    whereClause = " WHERE user_name LIKE ? OR user_email LIKE ? OR user_phone LIKE ? OR user_address LIKE ? OR role LIKE ?";
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
    values.push(`%${q}%`);
  }

  const countSql = `SELECT COUNT(*) AS total FROM users ${whereClause}`;

  db.query(countSql, values, (err, countResult) => {
    if (err) return callback(err);

    const total = countResult[0].total;

    let dataSql = `SELECT * FROM users ${whereClause} LIMIT ? OFFSET ?`;

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

export const createUser = (data, callback) => {
  let query = "INSERT INTO users SET ?";
  db.query(query, data, (err, result) => {
    callback(err, result);
  });
};

const updateUser = (id, data, callback) => {
  let query = "UPDATE users SET ? WHERE user_id = ?";
  db.query(query, [data, id], (err, result) => {
    callback(err, result);
  });
};

const deleteUser = (id, callback) => {
  let query = "DELETE FROM users WHERE user_id = ?";
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const deleteAllUsers = (callback) => {
  let query = "DELETE FROM users";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

export default {
  getAllUsers,
  getUserById,
  findUserByEmail,
  getUsersByQuery,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
};
