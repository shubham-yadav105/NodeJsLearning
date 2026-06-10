const express = require("express");
const router = express.Router();
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/postController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");
const commentRoutes = require("./commentRoutes");

router.use("/:postId/comments", commentRoutes);

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authMiddleware, upload.single("thumbnail"), createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;