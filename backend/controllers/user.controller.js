import userModel from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ email: { $ne: req.user.email } });

        res.json({
            success: false,
            message: "Fetched all users successfully",
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Error in fetching all users",
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = user.role === "admin" ? "user" : "admin";

        if (user.role === "admin") {
            user.canCreateProject = true;
        } else {
            user.canCreateProject = false;
        }
        
        await user.save();

        res.json({
            success: true,
            message: `Updated user role to ${user.role}`,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "User role update failed",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Access denied" });

        await userModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "User deletion failed",
        });
    }
};

export const setProjectPermission = async (req, res) => {
    try {
        const { allowed } = req.body;

        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            { canCreateProject: allowed },
            { new: true },
        );
        res.json({
            success: true,
            message: "Project permission set successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Failed to set project permission",
        });
    }
};
