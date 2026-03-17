import express from "express";
import {
    createTask,
    deleteTask,
    getProjectTasks,
    getTasksForAdmin,
    moveTask,
    updateTask,
} from "../controllers/task.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import requireProjectMember from "../middlewares/projectAccess.middleware.js";
import requireTaskAccess from "../middlewares/taskAccess.middleware.js";

const taskRouter = express.Router();

taskRouter.post("/", authMiddleware, requireProjectMember, createTask);
taskRouter.get(
    "/project/:projectId",
    authMiddleware,
    requireProjectMember,
    getProjectTasks,
);
taskRouter.get("/project/:projectId/admin", getTasksForAdmin);
taskRouter.patch("/:id", authMiddleware, requireTaskAccess, updateTask);
taskRouter.patch("/:id/move", authMiddleware, requireTaskAccess, moveTask);
taskRouter.delete("/:id", authMiddleware, requireTaskAccess, deleteTask);

export default taskRouter;
