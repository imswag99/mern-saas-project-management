import express from "express";
import cors from "cors";
import "dotenv/config";
import { dbConn } from "./config/db.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import commentRouter from "./routes/comment.route.js";

// app configuration
const app = express();
const server = http.createServer(app);
const PORT = 8000;

// database connection
dbConn();

// parsing cookies
app.use(cookieParser());

// middleware
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173", "https://localhost:5173", "https://mern-project-management-saas.vercel.app"],
        credentials: true,
    }),
);

// API endpoints
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/comments", commentRouter);

// test endpoint
app.get("/test", (req, res) => {
    res.send("API is working");
});

// starting server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://localhost:5173", "https://mern-project-management-saas.vercel.app"],
        credentials: true,
    },
});

// io accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
    socket.on("joinTaskRoom", (taskId) => {
        socket.join(taskId);
    });

    socket.on("leaveTaskRoom", (taskId) => {
        socket.leave(taskId);
    });

    socket.on("sendComment", (comment) => {
        io.to(comment.task).emit("receiveComment", comment);
    });

    socket.on("deleteComment", ({ commentId, taskId }) => {
        io.to(taskId).emit("commentDeleted", commentId);
    });
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
