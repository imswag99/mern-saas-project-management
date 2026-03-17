import express from "express";
import {
    createProject,
    getAllProjects,
    getMyProjects,
    getProjectById,
} from "../controllers/project.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.post("/", authMiddleware, createProject);
projectRouter.get("/", authMiddleware, getAllProjects);
projectRouter.get("/myProjects", authMiddleware, getMyProjects);
projectRouter.get("/:id", authMiddleware, getProjectById);

export default projectRouter;