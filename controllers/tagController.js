const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany({
            include: {
                _count: { select: { posts: true } }  // post count per tag
            },
            orderBy: { name: "asc" }
        });
        res.json(tags);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        const existing = await prisma.tag.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ message: "Tag already exists" });
        }

        const tag = await prisma.tag.create({ data: { name, slug } });
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tag = await prisma.tag.findUnique({ where: { id } });

        if (!tag) return res.status(404).json({ message: "Tag not found" });

        await prisma.tag.delete({ where: { id } });
        res.json({ message: "Tag deleted successfull" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllTags, createTag, deleteTag };
