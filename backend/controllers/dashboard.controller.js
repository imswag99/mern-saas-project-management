import mongoose from "mongoose";
import taskModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";

export const getDashboardData = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const totalProjects = await projectModel.countDocuments({
            "members.user": userId,
        });

        const taskStats = await taskModel.aggregate([
            {
                $match: { assignedTo: userId },
            },
            {
                $facet: {
                    overview: [
                        {
                            $group: {
                                _id: null,
                                totalTasks: { $sum: 1 },
                                completedTasks: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "done"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                                overdue: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $and: [
                                                    {
                                                        $ne: [
                                                            "$status",
                                                            "done",
                                                        ],
                                                    },
                                                    {
                                                        $lt: [
                                                            "$dueDate",
                                                            new Date(),
                                                        ],
                                                    },
                                                ],
                                            },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    ],

                    statusDistribution: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    tasksOverTime: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m",
                                        date: "$createdAt",
                                    },
                                },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],

                    upcomingTasks: [
                        {
                            $match: {
                                dueDate: { $exists: true, $ne: null },
                                status: { $ne: "done" },
                            },
                        },
                        { $sort: { dueDate: 1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                title: 1,
                                dueDate: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const overviewData = taskStats[0].overview[0] || {
            totalTasks: 0,
            completedTasks: 0,
            overdue: 0,
        };

        res.json({
            stats: {
                totalProjects,
                totalTasks: overviewData.totalTasks,
                completedTasks: overviewData.completedTasks,
                overdue: overviewData.overdue,
            },
            statusDistribution: taskStats[0].statusDistribution,
            tasksOverTime: taskStats[0].tasksOverTime,
            upcomingTasks: taskStats[0].upcomingTasks,
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAdminDashboardData = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalProjects = await projectModel.countDocuments();
        const totalTasks = await taskModel.countDocuments();
        const completedTasks = await taskModel.countDocuments({
            status: "done",
        });
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        const overview = {
            totalUsers,
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate,
        };

        const taskStats = await taskModel.aggregate([
            {
                $facet: {
                    statusDistribution: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    tasksOverTime: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m",
                                        date: "$createdAt",
                                    },
                                },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],
                    tasksPerUser: [
                        {
                            $group: {
                                _id: "$assignedTo",
                                totalTasks: { $sum: 1 },
                                completedTasks: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", "done"] },
                                            1,
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        { $unwind: "$user" },
                        {
                            $project: {
                                userId: "$user._id",
                                name: "$user.name",
                                totalTasks: 1,
                                completionRate: {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$completedTasks",
                                                "$totalTasks",
                                            ],
                                        },
                                        100,
                                    ],
                                },
                            },
                        },
                        { $sort: { completionRate: -1 } },
                    ],
                },
            },
        ]);

        const stats = taskStats[0];

        const ALL_STATUSES = ["todo", "in-progress", "review", "done"];
        const statusMap = {};
        (stats.statusDistribution || []).forEach((s) => {
            statusMap[s._id] = s.count;
        });
        const statusDistribution = ALL_STATUSES.map((status) => ({
            status,
            count: statusMap[status] || 0,
        }));

        const tasksOverTime = (stats.tasksOverTime || []).map((t) => ({
            month: t._id,
            count: t.count,
        }));

        res.json({
            overview,
            statusDistribution,
            tasksOverTime,
            tasksPerUser: stats.tasksPerUser || [],
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({ message: error.message });
    }
};
