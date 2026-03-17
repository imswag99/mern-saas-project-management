import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import TaskBoard from "../components/task/TaskBoard";

const InfoCard = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
    >
        <div className="text-sm text-white/50 mb-2">{title}</div>
        <div className="text-2xl font-bold capitalize">{children}</div>
    </motion.div>
);

export default function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        const projRes = await api.get(`/projects/${id}`);

        setProject(projRes.data.project);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, [id]);

    if (loading) return <div className="pt-32 text-center">Loading...</div>;
    if (!project) return null;

    const manager = project.members.find((m) => m.role === "manager");

    return (
        <div className="max-w-6xl mx-auto px-6 py-24 text-white">
            <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
            <p className="text-white/70 mb-10">{project.description}</p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <InfoCard title="Manager">{manager?.user?.name}</InfoCard>

                <InfoCard title="Members">{project.members.length}</InfoCard>

                <InfoCard title="Created">
                    {new Date(project.createdAt).toLocaleDateString()}
                </InfoCard>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl mb-14">
                <h2 className="text-xl font-semibold mb-6">Team Members</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {project.members?.map((m) => (
                        <motion.div
                            key={m.user._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3"
                        >
                            <div>
                                <div className="font-medium capitalize">
                                    {m.user.name}
                                </div>
                                <div className="text-xs text-white/50">
                                    {m.user.email}
                                </div>
                            </div>

                            <span
                                className={`
                  px-3 py-1 rounded-lg text-xs font-semibold
                  ${
                      m.role === "manager"
                          ? "bg-purple-500/30 text-purple-300"
                          : "bg-indigo-500/30 text-indigo-300"
                  }
                `}
                            >
                                {m.role}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <TaskBoard projectId={project._id} members={project.members} />
        </div>
    );
}
