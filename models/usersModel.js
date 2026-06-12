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

const getUsersByQuery = ({ q, page = 1, limit = 5 }, callback) => {
  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM users";
  let values = [];

  if (q) {
    sql += " WHERE user_name LIKE ? OR user_email LIKE ? OR user_phone LIKE ? OR user_address LIKE ?";
    const keyword = `%${q}%`;
    values.push(keyword, keyword, keyword, keyword);
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), parseInt(offset));

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

const createUser = (data, callback) => {
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
  getAllUsers, getUserById, getUsersByQuery, createUser, updateUser, deleteUser, deleteAllUsers,
};