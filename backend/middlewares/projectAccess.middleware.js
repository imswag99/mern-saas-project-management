import projectModel from "../models/project.model.js";

const requireProjectMember = async (req, res, next) => {
    try {
        const { projectId } =
            req.body || req.params || req.query;

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID required",
            });
        }

        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (m) => m.user.toString() === req.user.id,
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Not a project member",
            });
        }

        req.project = project;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Project access check failed",
        });
    }
};

export default requireProjectMember;