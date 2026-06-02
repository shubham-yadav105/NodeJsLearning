const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key_here";

// Like Laravel's auth:sanctum middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // get token after "Bearer "

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // like auth()->user() in Laravel
        next(); // like calling the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;