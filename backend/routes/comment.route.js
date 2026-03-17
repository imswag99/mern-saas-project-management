import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createComment, deleteComment, getCommentsByTask } from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/", authMiddleware, createComment);
commentRouter.get("/:taskId", authMiddleware, getCommentsByTask);
commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;