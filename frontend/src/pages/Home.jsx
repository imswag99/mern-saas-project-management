import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-extrabold leading-tight"
                        >
                            TaskPilot
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-lg md:text-xl text-white/80"
                        >
                            A smart project management platform with role-based
                            control, team workflows, and AI-assisted support —
                            built for modern teams.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link
                                to={
                                    user
                                        ? user.role === "admin"
                                            ? "/admin"
                                            : "/dashboard"
                                        : "/register"
                                }
                                className="px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg hover:scale-105 transition"
                            >
                                {user ? "Dashboard" : "Get Started"}
                            </Link>

                            <Link
                                to={user ? "/projects" : "/login"}
                                className="px-8 py-4 rounded-xl border border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/20 transition"
                            >
                                {user ? "Projects" : "Login"}
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-purple-600/20 blur-3xl rounded-3xl" />

                        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
                            <img
                                src="/home.jpg"
                                alt="Project dashboard illustration"
                                className="w-full h-auto object-contain rounded-xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Role-Based Control",
                        desc: "Admins grant project creation rights. Managers lead. Members collaborate.",
                    },
                    {
                        title: "Project Ownership",
                        desc: "Creator automatically becomes manager for clean authority structure.",
                    },
                    {
                        title: "AI Ready",
                        desc: "Designed for AI assistant and smart workflow features.",
                    },
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl"
                    >
                        <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                        <p className="text-white/70">{f.desc}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};

export default Home;
