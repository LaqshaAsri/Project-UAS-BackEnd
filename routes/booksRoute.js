import express from "express";
import borrowingsModel from "../models/borrowingsModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET semua borrowing (admin: semua data + query/pagination, member: hanya miliknya)
router.get("/", verifyToken, (req, res) => {
  const { q, page, limit } = req.query;
  const user_id = req.user.id;
  const user_role = req.user.role;

  // Jika role "user" (member), hanya tampilkan data miliknya
  if (user_role === "user") {
    borrowingsModel.getAllBorrowings((err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }
      const myBorrowings = result.filter((b) => b.user_id === user_id);
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data peminjaman milik Anda",
        data: myBorrowings,
      });
    });
    return;
  }

  // Jika admin/petugas, mendukung query/pagination
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
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data",
        data: result,
      });
    });
  }
});

// GET borrowing berdasarkan ID
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

// POST /borrowing — Proses pinjam buku secara otomatis (khusus member)
router.post("/borrowing", verifyToken, (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.id;
  const user_role = req.user.role;
  const email_user = req.user.email;

  if (user_role !== "user") {
    return res.status(403).json({
      status: 403,
      message: "Akses ditolak, hanya akun member yang boleh meminjam buku",
    });
  }

  if (!book_id) {
    return res.status(400).json({ status: 400, message: "book_id wajib disertakan" });
  }

  const borrowDate = new Date();
  const returnLimitDate = new Date();
  returnLimitDate.setDate(borrowDate.getDate() + 7);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const dataPeminjaman = {
    user_id,
    book_id,
    borrow_date: formatDate(borrowDate),
    return_date: formatDate(returnLimitDate),
    STATUS: "dipinjam",
    created_by: email_user || "Member",
    updated_by: email_user || "Member",
  };

  borrowingsModel.createBorrowing(dataPeminjaman, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Gagal memproses peminjaman pada database",
        error: err.message,
      });
    }
    res.status(201).json({
      status: 201,
      message: "Buku berhasil dipinjam secara otomatis!",
      id: result.insertId,
    });
  });
});

// POST /returning — Proses kembalikan buku (khusus member)
router.post("/returning", verifyToken, (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.id;
  const email_user = req.user.email;

  if (!book_id) {
    return res.status(400).json({ status: 400, message: "book_id wajib disertakan" });
  }

  borrowingsModel.getActiveBorrowingByMember(user_id, book_id, (err, borrowing) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Kesalahan server database",
        error: err.message,
      });
    }

    if (!borrowing) {
      return res.status(404).json({
        status: 404,
        message: "Riwayat peminjaman aktif tidak ditemukan untuk akun Anda pada buku ini",
      });
    }

    const hariIni = new Date();
    const batasPengembalian = new Date(borrowing.return_date);

    let statusAkhir = "dikembalikan";
    if (hariIni > batasPengembalian) {
      statusAkhir = "terlambat";
    }

    const tanggalKembaliAktual = hariIni.toISOString().split("T")[0];

    const dataUpdate = {
      return_date: tanggalKembaliAktual,
      STATUS: statusAkhir,
      updated_by: email_user || "Member",
    };

    borrowingsModel.updateBorrowing(borrowing.borrowing_id, dataUpdate, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Gagal memperbarui status pengembalian",
          error: err.message,
        });
      }
      res.status(200).json({
        status: 200,
        message:
          statusAkhir === "terlambat"
            ? "Buku berhasil dikembalikan, namun status Anda TERLAMBAT!"
            : "Buku dikembalikan tepat waktu!",
        statusAkhir,
      });
    });
  });
});

// POST / — Tambah data borrowing manual (admin/petugas)
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

// PUT /:id — Update data borrowing (admin/petugas)
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

// DELETE /:id — Hapus satu data borrowing
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

// DELETE / — Hapus semua data borrowing
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