const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;
        const tagId = req.query.tagId ? parseInt(req.query.tagId) : null;

        // Build filters dynamically
        const filters = {};
        if (search) {
            filters.OR = [
                { title: { contains: search } },
                { body: { contains: search } }
            ];
        }
        if (categoryId) filters.categoryId = categoryId;

        // filter by tag - through junction table
        if (tagId) {
            filters.tags = { some: { tagId } };
        }

        const [posts, totalPosts] = await Promise.all([
            prisma.post.findMany({
                skip, take: limit, where: filters,
                include: {
                    user: { select: { id: true, name: true, avatar: true } },
                    category: true,
                    tags: { include: { tag: true } },
                    _count: { select: { comments: true } }
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.post.count({ where: filters })
        ]);

        res.json({
            data: posts,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts,
                hasNextPage: page < Math.ceil(totalPosts / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                category: true,
                tags: { include: { tag: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { createdAt: "desc" }
                },
                _count: { select: { comments: true } }
            }
        });

        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, body, categoryId, tagIds } = req.body;
        const userId = req.user.id;

        // Auto calculate reading time
        // Average person reads 200 words per minute
        const wordCount = body.split(" ").length;
        const readingTime = Math.ceil(wordCount / 200); // in minutes

        // Handle thumbnail if uploaded
        const thumbnail = req.file ? "uploads/" + req.file.filename : null;

        const post = await prisma.post.create({
            data: {
                title,
                body,
                thumbnail,
                readingTime, // auto calculated!
                userId,
                categoryId: categoryId ? parseInt(categoryId) : null,
                // Connect tags - like sync() in Laravel
                tags: tagIds ? {
                    create: JSON.parse(tagIds).map(tagId => ({
                        tag: { connect: { id: parseInt(tagId) } }
                    }))
                } : undefined
            },
            include: {
                user: { select: { id: true, name: true } },
                category: true,
                tags: { include: { tag: true } }
            }
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;
        const { title, body, categoryId } = req.body;

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.userId !== userId) {
            return res.status(403).json({ message: "You can only update your own posts" });
        }

        // Recalculate reading time if body changed
        const readingTime = body ? Math.ceil(body.split(" ").length / 200) : post.readingTime;

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title, body, readingTime,
                categoryId: categoryId ? parseInt(categoryId) : null
            }
        });

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.userId !== userId) {
            return res.status(403).json({ message: "You can only delete your own posts" });
        }

        // Delete thumbnail file if exists
        if (post.thumbnail) {
            const filePath = path.join(__dirname, "..", post.thumbnail);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await prisma.post.delete({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };