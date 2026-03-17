import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();
    const manager = project.members.find((m) => m.role === "manager");

    return (
        <motion.div
            onClick={() => navigate(`/projects/${project._id}`)}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="
                overflow-hidden
                bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-transparent
                border border-white/20
                rounded-2xl p-6
                shadow-xl
                cursor-pointer
                text-white
                hover:opacity-100
                hover:bg-linear-to-br hover:from-indigo-500 hover:via-indigo-500 hover:to-indigo-600
            "
        >
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 transition">
                    {project.title}
                </h3>

                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                    {project.description || "No description provided"}
                </p>

                <div className="flex items-center justify-between text-sm text-white/70 mb-4 capitalize">
                    <span>👤 {manager?.user?.name || "No Manager"}</span>

                    <span>👥 {project.members.length}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-white/50">
                    <span>
                        Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                    </span>

                    <span className="group-hover:text-indigo-300 transition">
                        View →
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
