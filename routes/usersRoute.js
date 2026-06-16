import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import usersModel from "../models/usersModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.get("/", (req, res) => {
  const { q, page, limit } = req.query;

  if (q || page || limit) {
    usersModel.getUsersByQuery({ q, page, limit }, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }
      if (result.data.length === 0) {
        return res.status(200).json({
          status: 200,
          message: "Data user tidak ditemukan",
          total: 0,
          data: [],
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data",
        total: result.total,
        data: result.data,
      });
    });
  } else {
    usersModel.getAllUsers((err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }
      if (result.length === 0) {
        return res.status(200).json({
          status: 200,
          message: "Data user tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data",
        data: result,
      });
    });
  }
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  usersModel.getUserById(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data users tidak ditemukan",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data",
      data: result,
    });
  });
});

// CREATE - wajib login (admin menambah user dari adminUsers.html)
router.post("/", verifyToken, async (req, res) => {
  const data = req.body;

  if (!data.user_name) {
    return res.status(400).json({
      status: 400,
      message: "user_name wajib diisi",
    });
  }

  if (!data.user_password) {
    return res.status(400).json({
      status: 400,
      message: "user_password wajib diisi",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(data.user_password, 10);

    const payload = {
      ...data,
      user_password: hashedPassword,
      created_by: req.user.email,
      updated_by: req.user.email,
    };

    usersModel.createUser(payload, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          const message = err.sqlMessage;

          if (message.includes("user_email")) {
            return res.status(400).json({
              status: 400,
              message: "Email sudah digunakan",
            });
          }

          if (message.includes("user_phone")) {
            return res.status(400).json({
              status: 400,
              message: "Nomor HP sudah digunakan",
            });
          }

          if (message.includes("PRIMARY")) {
            return res.status(400).json({
              status: 400,
              message: "ID sudah digunakan",
            });
          }

          return res.status(400).json({
            status: 400,
            message: "Data duplikat terdeteksi",
          });
        }

        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }

      res.status(201).json({
        status: 201,
        message: "Berhasil menambahkan data",
        id: result.insertId,
      });
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Gagal hash password",
      error: err.message,
    });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (!data.user_name || !data.user_email) {
    return res.status(400).json({
      status: 400,
      message: "user_name dan user_email wajib diisi",
    });
  }

  try {
    const payload = { ...data };
    if (data.user_password) {
      payload.user_password = await bcrypt.hash(data.user_password, 10);
    } else {
      delete payload.user_password;
    }

    payload.updated_by = req.user.email;

    usersModel.updateUser(id, payload, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data users tidak ditemukan",
        });
      }
      res.status(200).json({
        status: 200,
        message: "User berhasil diupdate",
      });
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Gagal hash password",
      error: err.message,
    });
  }
});

router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  usersModel.deleteUser(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data users tidak ditemukan",
      });
    }
    res.status(200).json({
      status: 200,
      message: "User berhasil dihapus",
    });
  });
});

router.delete("/", verifyToken, (req, res) => {
  usersModel.deleteAllUsers((err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    res.status(200).json({
      status: 200,
      message: "Semua data user berhasil dihapus",
    });
  });
});

export default router;