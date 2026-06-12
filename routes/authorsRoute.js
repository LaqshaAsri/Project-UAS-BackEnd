import express from "express";
const router = express.Router();
import authorsModel from "../models/authorsModel.js";

router.get("/", (req, res) => {
  const { q, page, limit } = req.query;

  if (q || page || limit) {
    authorsModel.getAuthorsByQuery({ q, page, limit }, (err, result) => {
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
          message: "Data author tidak ditemukan",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data",
        data: result,
      });
    });
  } else {
    authorsModel.getAllAuthors((err, result) => {
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
          message: "Data author tidak ditemukan",
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
  authorsModel.getAuthorById(id, (err, result) => {
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

router.post("/", (req, res) => {
  const data = req.body;
  if (!data.author_name) {
    return res.status(400).json({
      status: 400,
      message: "author_name wajib diisi",
    });
  }
  authorsModel.createAuthor(data, (err, result) => {
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

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  if (!data.author_name || !data.author_country) {
    return res.status(400).json({
      status: 400,
      message: "author_name dan author_country wajib diisi",
    });
  }
  authorsModel.updateAuthor(id, data, (err, result) => {
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
      message: "Author berhasil diupdate",
    });
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  authorsModel.deleteAuthor(id, (err, result) => {
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
      message: "Author berhasil dihapus",
    });
  });
});

router.delete("/", (req, res) => {
  authorsModel.deleteAllAuthors((err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    res.status(200).json({
      status: 200,
      message: "Semua data author berhasil dihapus",
    });
  });
});

export default router;