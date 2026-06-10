const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /posts:postId/comments - get all comments for a post
const getComments = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        const comments = await prisma.comments.findMany({
            where: {postId}, 
            include: {
                user: {select: {id:true, name: true, avatar: true}}
            }, 
            orderBy : { createdAt: "desc"}
        });
        res.json(comments);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

// POST /posts/:postId/comments - add comment to a post
const createComment = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const userId = req.user.id;
        const { body } = req.body;

        // check post exists 
        const post = await prisma.post.findUnique({ where: {id: postId }});
        if(!post) return res.status(404).json({ message: "Post not found" });

        const comment = await prisma.comment.create({
            data: {body, userId, postId },
            include: {
                user: { select: {id:true, name: true, avatar: true}}
            }
        });
        res.status(201).json(comment);
    }
    catch(error) {
        res.status(500).json({message: error.message });
    }
};

// DELETE /comment/:id - delete own comment 
const deleteComment = async (req, res) => {
     try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;

        const comment = await prisma.comment.findUnique({where: { id}});
        if (!comment) return res.status(404).json({message: "comment not found"});

        // only owner can delete 
        if(comment.userId != userId){
            return res.status(403).json({message: "you can olny delete your own comments"});
        }

        await prisma.comment.delete({ where: { id }});
        res.json({ message: "Comment deleted "});
    }
    catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getComments, createComment, deleteComment};
