const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createPostSchema, updatePostSchema } = require("../validators/postValidator");

const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/postController");

router.use(authMiddleware); // all post routes are protected

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", validate(createPostSchema), createPost);
router.put("/:id", validate(updatePostSchema), updatePost);
router.delete("/:id", deletePost);

module.export = router;