import taskModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";

export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            projectId,
            priority,
            assignedTo,
            dueDate,
            labels,
        } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({
                message: "Title and projectId required",
            });
        }

        const lastTask = await taskModel
            .findOne({
                projectId,
                status: "todo",
            })
            .sort("-order");

        const nextOrder = lastTask ? lastTask.order + 1 : 0;

        const task = await taskModel.create({
            title,
            description,
            projectId,
            priority,
            assignedTo: assignedTo || null,
            dueDate: dueDate || null,
            labels: labels || [],
            createdBy: req.user.id,
            order: nextOrder,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Create task failed",
        });
    }
};

export const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            status,
            priority,
            assignedTo,
            search,
            sortBy,
            order = "asc",
            page = 1,
            limit = 50,
        } = req.query;

        const query = { projectId };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        if (search) {
            query.$text = { $search: search };
        }

        let sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        } else {
            sortOptions = { status: 1, order: 1 };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const tasks = await taskModel
            .find(query)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name")
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const total = await taskModel.countDocuments(query);

        res.json({
            success: true,
            message: "Tasks fetched successfully",
            tasks,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Fetch tasks failed",
        });
    }
};

export const getTasksForAdmin = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            status,
            priority,
            assignedTo,
            search,
            sortBy,
            order = "asc",
            page = 1,
            limit = 50,
        } = req.query;

        const query = { projectId };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        if (search) {
            query.$text = { $search: search };
        }

        let sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        } else {
            sortOptions = { status: 1, order: 1 };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const tasks = await taskModel
            .find(query)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name")
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const total = await taskModel.countDocuments(query);

        res.json({
            success: true,
            message: "Tasks fetched successfully",
            tasks,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Fetch tasks failed",
        });
    }
};

export const getUserProjectTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;

        const tasks = await taskModel
            .find({
                projectId: projectId,
                assignedTo: userId,
            })
            .populate("assignedTo", "name email")
            .populate("projectId", "name")
            .sort({ dueDate: 1 });

        res.json({
            success: true,
            message: "Fetched user tasks successfully",
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = req.task;
        const { id } = req.params;

        if (
            req.user.role !== "admin" &&
            task.assignedTo.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const allowed = [
            "title",
            "description",
            "priority",
            "assignedTo",
            "dueDate",
            "labels",
        ];

        const update = {};

        for (const key of allowed) {
            if (key in req.body) {
                update[key] = req.body[key];
            }
        }

        const updatedTask = await taskModel.findByIdAndUpdate(id, update, {
            new: true,
        });

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        res.json({
            success: true,
            message: "Task updated successfully",
            updatedTask,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Update task failed",
        });
    }
};

export const moveTask = async (req, res) => {
    try {
        const { status } = req.body;
        const task = req.task;

        if (
            req.user.role !== "admin" &&
            task.assignedTo.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not allowed" });
        }

        if (!status) {
            return res.status(400).json({
                message: "status required",
            });
        }

        // find last order in target column
        const last = await taskModel
            .findOne({
                projectId: task.projectId,
                status,
            })
            .sort("-order");

        const nextOrder = last ? last.order + 1 : 0;

        task.status = status;
        task.order = nextOrder;

        await task.save();

        res.json({
            success: true,
            message: "Task moved successfully",
            task,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Move task failed",
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = req.task;
        const { id } = req.params;

        if (
            req.user.role !== "admin" &&
            task.assignedTo.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const deletedTask = await taskModel.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        res.json({
            success: true,
            message: "Task deleted",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Delete task failed",
        });
    }
};
