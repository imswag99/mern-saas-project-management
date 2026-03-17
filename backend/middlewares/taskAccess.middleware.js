import taskModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";

const requireTaskAccess = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID required",
            });
        }

        // load task
        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        // load project
        const project = await projectModel.findById(task.projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        // membership check
        const isMember = project.members.some(
            (m) => m.user.toString() === req.user.id,
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Not allowed to access this task",
            });
        }

        // attach for controller reuse (avoids refetch)
        req.task = task;
        req.project = project;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Task access check failed",
        });
    }
};


export default requireTaskAccess;