import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import { deleteUser, getAllUsers, setProjectPermission, updateUserRole } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", authMiddleware, getAllUsers);
userRouter.patch("/:id/", authMiddleware, adminOnly, updateUserRole);
userRouter.delete("/:id", authMiddleware, adminOnly, deleteUser);
userRouter.patch(
    "/:id/project-permission",
    authMiddleware,
    adminOnly,
    setProjectPermission,
);

export default userRouter;
