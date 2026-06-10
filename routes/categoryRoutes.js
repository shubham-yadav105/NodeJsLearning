const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth");

router.get("/", getAllCategories);
router.post("/", authMiddleware, createCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;