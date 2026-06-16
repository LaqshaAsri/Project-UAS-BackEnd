import express from "express";
const router = express.Router();
import categoriesModel from "../models/categoriesModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.get("/", (req, res) => {
  const { q, page, limit } = req.query;

  if (q || page || limit) {
    categoriesModel.getCategoriesbyQuery({ q, page, limit }, (err, result) => {
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
          message: "Data kategori tidak ditemukan",
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
    categoriesModel.getAllCategories((err, result) => {
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
          message: "Data kategori tidak ditemukan",
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
  categoriesModel.getCategorybyId(id, (err, result) => {
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
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({
      status: 400,
      message: "category_name wajib diisi",
    });
  }

  categoriesModel.cekCategoryByName(category_name, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    if (result.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Category Name sudah ada",
      });
    }

    const data = {
      category_name,
      created_by: req.user.email,
      updated_by: req.user.email,
    };

    categoriesModel.createCategory(data, (err, result) => {
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
});

router.put("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({
      status: 400,
      message: "category_name wajib diisi",
    });
  }

  const data = {
    category_name,
    updated_by: req.user.email,
  };

  categoriesModel.updateCategory(id, data, (err, result) => {
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
    res.json({ message: "Category berhasil diupdate" });
  });
});

router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  categoriesModel.deleteCategorybyId(id, (err, result) => {
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
    res.json({ message: "Category berhasil dihapus" });
  });
});

router.delete("/", verifyToken, (req, res) => {
  categoriesModel.deleteAllCategories((err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    res.json({ message: "Semua data category berhasil dihapus" });
  });
});

export default router;