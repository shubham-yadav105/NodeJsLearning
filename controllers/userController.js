const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // like using the DB facade in Laravel
const path = require("path");
const fs = require("fs");   // build-in Node.js - like PHP's unlink()


// GET /users - like User::all()
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /users/:id - like User::findOrFail($id)
const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /users - like User::create($request->all())
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const newUser = await prisma.user.create({
            data: { name, email }
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Put /users/:id - like update() in Laravel
const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email } = req.body;
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const updateUser = await prisma.user.update({
            where: { id },
            data: { name, email } // only update fields that are provided - like $request->only() in Laravel

        });
        res.json(updateUser);

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

};

// DELETE /users/:id - like User::destroy($id)
const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await prisma.user.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /users/avatar - upload profile picture
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const userId = req.user.id; // from JWT token 

        //Check if user already has an avatar - delete old one
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user.avatar) {
            const oldPath = path.join(__dirname, "..", user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath); // like Storage::delete() in Laravel
            }
        }

        // Save new avatar path to database 
        const avatarPath = "uploads/" + req.file.filename;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarPath },
            select: { id: true, name: true, email: true, avatar: true }
        });

        res.json({
            message: "Avatar uploaded successfully",
            user: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /users/avatr/:filename - serve the image

const getAvatar = async (req, res) => {
    try {
        const filePath = path.join(__dirname, "..", "upload", req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.sendFile(filePath); // like Storage::url() in Laravel
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, uploadAvatar, getAvatar };