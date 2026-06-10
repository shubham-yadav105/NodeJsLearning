const express = require("express");
const router = express.Router({ mergeParams: true});

// mergeParams lets us access :postId from parent routes
const { getComments, createComment, deleteComment } = require("../controllers/commentController");
const authMiddleware = require("../middleware/auth");

router.get("/", getComments);
router.post("/", authMiddleware, createComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;