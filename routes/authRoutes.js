const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const authMiddleware = require("../middleware/auth");

// validate middleware runs BEFORE constroller - like FormRequest in Laravel 
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile",authMiddleware, getProfile);

module.exports = router;