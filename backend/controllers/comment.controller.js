import commentModel from "../models/comment.model.js";

export const createComment = async (req, res) => {
    try {
        const { content, taskId } = req.body;

        if (!content)
            return res.status(400).json({ message: "Comment cannot be empty" });

        const comment = await commentModel.create({
            content,
            task: taskId,
            user: req.user.id,
        });

        const populatedComment = await comment.populate(
            "user",
            "name email avatar",
        );

        const io = req.app.get("io");
        io.to(taskId).emit("newComment", populatedComment);

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            populatedComment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create comment",
        });
    }
};

export const getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await commentModel
            .find({ task: taskId })
            .populate("user", "name email avatar")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            message: "Fetched comments successfully",
            comments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch comments",
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await commentModel.findById(commentId);

        if (!comment)
            return res.status(404).json({ message: "Comment not found" });

        if (
            comment.user.toString() !== req.user.id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Not authorized" });
        }

        const taskId = comment.task;

        await comment.deleteOne();

        const io = req.app.get("io");
        io.to(taskId.toString()).emit("commentDeleted", commentId);

        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete comment",
        });
    }
};
