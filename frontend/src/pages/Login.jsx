import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            const profile = await login(form);

            if (profile.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="pt-32 text-center text-red-400">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full p-3 rounded-lg bg-white/10"
                    placeholder="Email"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />
                <input
                    type="password"
                    className="w-full p-3 rounded-lg bg-white/10"
                    placeholder="Password"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <button
                    className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 font-semibold"
                    disabled={loading}
                >
                    { loading ? "Logging in..." : "Login" }
                </button>
            </form>
            <h1 className="mt-5 text-white text-center">
                Don't have an account yet?{" "}
                <Link
                    className="text-indigo-400 font-semibold"
                    to={"/register"}
                >
                    Register here
                </Link>
            </h1>
        </div>
    );
};

export default Login;
