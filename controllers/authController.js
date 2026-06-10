const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET; // in real apps put this in .env

// REGISTER - like AuthController@register in Laravel
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists - like User::where('email', $email)->exists()
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password - like Hash::make($password) in Laravel
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN - like AuthController@login in Laravel
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user - like User::where('email', $email)->first()
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password - like Hash::check($password, $user->password)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token - like $user->createToken('auth_token')
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                // count their posts and comments
                _count: {
                    select: { posts: true, comments: true }
                }
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getProfile };