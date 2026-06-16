import express from "express";
const router = express.Router();
import borrowingsModel from "../models/borrowingsModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.get("/", (req, res) => {
  const { q, page, limit } = req.query;

  if (q || page || limit) {
    borrowingsModel.getBorrowingsByQuery({ q, page, limit }, (err, result) => {
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
          message: "Data borrowing tidak ditemukan",
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
    borrowingsModel.getAllBorrowings((err, result) => {
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
          message: "Data borrowing tidak ditemukan",
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
  borrowingsModel.getBorrowingById(id, (err, result) => {
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
        message: "Data tidak ditemukan",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data",
      data: result,
    });
  });
});

router.post("/", verifyToken, (req, res) => {
  const data = req.body;

  if (!data.user_id || !data.borrow_date || !data.STATUS) {
    return res.status(400).json({
      status: 400,
      message: "user_id, borrow_date, dan STATUS wajib diisi",
    });
  }
  const validStatus = ["dipinjam", "dikembalikan", "terlambat"];
  if (!validStatus.includes(data.STATUS)) {
    return res.status(400).json({
      status: 400,
      message: "STATUS harus dipinjam, dikembalikan, atau terlambat",
    });
  }
  if ((data.STATUS === "dikembalikan" || data.STATUS === "terlambat") && !data.return_date) {
    return res.status(400).json({
      status: 400,
      message: "return_date wajib diisi jika STATUS dikembalikan atau terlambat",
    });
  }

  data.created_by = req.user.email;
  data.updated_by = req.user.email;

  borrowingsModel.createBorrowing(data, (err, result) => {
    if (err) {
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
});

router.put("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (!data.STATUS) {
    return res.status(400).json({
      status: 400,
      message: "STATUS wajib diisi",
    });
  }
  const validStatus = ["dipinjam", "dikembalikan", "terlambat"];
  if (!validStatus.includes(data.STATUS)) {
    return res.status(400).json({
      status: 400,
      message: "STATUS harus dipinjam, dikembalikan, atau terlambat",
    });
  }
  if ((data.STATUS === "dikembalikan" || data.STATUS === "terlambat") && !data.return_date) {
    return res.status(400).json({
      status: 400,
      message: "return_date wajib diisi jika STATUS dikembalikan atau terlambat",
    });
  }

  data.updated_by = req.user.email;

  borrowingsModel.updateBorrowing(id, data, (err, result) => {
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
        message: "Data tidak ditemukan",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Borrowing berhasil diupdate",
    });
  });
});

router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  borrowingsModel.deleteBorrowing(id, (err, result) => {
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
        message: "Data tidak ditemukan",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Borrowing berhasil dihapus",
    });
  });
});

router.delete("/", verifyToken, (req, res) => {
  borrowingsModel.deleteAllBorrowings((err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    res.status(200).json({
      status: 200,
      message: "Semua data borrowing berhasil dihapus",
    });
  });
});

export default router;