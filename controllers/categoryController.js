const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /categories - list all categories with post count
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { posts: true } // show how many posts in each category
                }
            },
            orderBy: { name: "asc" }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /categories - create category (auto generate slug)
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Generate slug from name - like Str::slug() in Laravel
        // "Node JS Tutorial" → "node-js-tutorial"
        const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = await prisma.category.create({
            data: { name, slug }
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /categories/:id
const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await prisma.category.delete({ where: { id } });
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllCategories, createCategory, deleteCategory };