import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa6";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl px-6 py-3 text-white">
            <div className="flex items-center justify-between gap-6">
                <Link to={"/"} className="font-bold text-lg">
                    TaskPilot
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                        Dashboard
                    </Link>
                    <Link to="/projects">Projects</Link>

                    {user?.role === "admin" && (
                        <Link to="/admin-panel">Admin</Link>
                    )}

                    {user && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <button className="cursor-pointer" onClick={handleLogout}>
                                <span className="text-white/80 hover:text-red-500 transition">
                                    <FaPowerOff className="w-4 h-4" />
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="text-white text-2xl md:hidden"
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {open && (
                <div className="mt-4 flex flex-col gap-3 md:hidden">
                    <Link
                        to={user?.role === "admin" ? "/admin" : "/dashboard"}
                        onClick={() => setOpen(!open)}
                    >
                        Dashboard
                    </Link>
                    <Link to="/projects" onClick={() => setOpen(!open)}>
                        Projects
                    </Link>

                    {user?.role === "admin" && (
                        <Link to="/admin-panel" onClick={() => setOpen(!open)}>
                            Admin
                        </Link>
                    )}

                    {user && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <button className="cursor-pointer" onClick={handleLogout}>
                                <span className="text-white/80 hover:text-red-500 transition">
                                    <FaPowerOff className="w-4 h-4" />
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
