const express = require("express");
const router = express.Router();
const { getAllTags, createTag, deleteTag} = require("../controllers/tagController");
const authMiddleware = require("../middleware/auth");

router.get("/", getAllTags);
router.post("/", authMiddleware, createTag);
router.delete("/:id", authMiddleware, deleteTag);

module.exports = router;
