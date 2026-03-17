import projectModel from "../models/project.model.js";

export const createProject = async (req, res) => {
    try {
        if (!req.user.canCreateProject) {
            return res.status(403).json({
                sucess: false,
                message: "Not allowed to create project",
            });
        }

        const { title, description, memberIds = [] } = req.body;

        const members = [];

        members.push({
            user: req.user.id,
            role: "manager",
        });

        memberIds.forEach((id) => {
            members.push({
                user: id,
                role: "member",
            });
        });

        const project = await projectModel.create({
            title,
            description,
            owner: req.user.id,
            members,
        });

        res.json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Failed to create project",
        });
    }
};

export const getMyProjects = async (req, res) => {
    try {
        const projects = await projectModel
            .find({
                "members.user": req.user.id,
            })
            .populate("members.user", "name email");

        res.json({
            success: true,
            message: "Fetched projects successfully",
            projects,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await projectModel
            .find({})
            .populate("members.user", "name email");

        res.json({
            success: true,
            message: "Fetched projects successfully",
            projects,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await projectModel
            .findById(req.params.id)
            .populate("members.user", "name email");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({
            success: true,
            message: "Single project fetched successfully",
            project,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Could not fetch project",
        });
    }
};
