const { PrismClient } = require('@prisma/client');
const { parse } = require('dotenv');

const prisma = new PrismaClient();

// GET /posts - get all posts with their user (like Post::with('user')->get())

const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include:
            {
                user: {
                    select: { id: true, name: true, email: true } // hide password 
                }
            } // eager load the user relationship 
        });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /posts/:id - get a single post by id with its user (like Post::with('user')->findOrFail($id))
const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: {
                    select: { id: true, name: true, email: true } // hide password

                }
            }
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /users/:id/posts - get all posts by a user (like $user->posts)

const getPostsByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: true // like $user->posts in laravel 
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            posts: user.posts
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// POST /Post - create post for logged in user
const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const userId = req.user.id; // from JWT token - like auth()->id() in Laravel 

        const post = await prisma.post.create({
            data: { title, body, userId }
        });

        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// PUT /posts/:id - update post (only owner can update)
const updatePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;
        const { title, body } = req.body;

        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Only owner can update - like $this->authorize('update', $post)
        if (post.userId !== userId) {
            return res.status(403).json({ message: "You can olny update your own posts" });
        }

        const updatePost = await prisma.post.update({
            where: { id },
            data: { title, body }
        });

        res.json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /posts/:id - delete post (only owner can delete )
const deletePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userid = req.user.id;

        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Olny owner can delete 

        if (post.userId !== userId) {
            return res.status(403).json({ message: "You can olny delete your own posts" });
        }

        await prisma.post.delete({ where: { id } });
        res.json({ message: "Post deleted successfully " });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

};

module.export = { getAllPosts, getPostById, getPostByUser, createPost, updatePost, deletePost}