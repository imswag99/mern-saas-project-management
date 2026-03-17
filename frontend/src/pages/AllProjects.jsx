import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectGrid from "../components/projects/ProjectGrid";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { useAuth } from "../context/AuthContext";

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const loadProjects = async () => {
        try {
            setLoading(true);

            const res = await api.get("/projects/");
            setProjects(res.data.projects);
        } catch {
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Projects</h1>

                {user.canCreateProject && (
                    <button
                        onClick={() => setOpen(true)}
                        className="px-6 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg hover:scale-105 transition"
                        disabled={loading}
                    >
                        Create Project
                    </button>
                )}
            </div>

            <ProjectGrid projects={projects} />

            {open === true && (
                <CreateProjectModal
                    onClose={() => setOpen(false)}
                    onCreated={loadProjects}
                />
            )}
        </div>
    );
};

export default AllProjects;
