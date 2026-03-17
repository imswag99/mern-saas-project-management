import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            await register(form);
            navigate("/login");
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
            <h2 className="text-2xl font-bold mb-6">Register</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    placeholder="Name"
                    className="input"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    placeholder="Email"
                    className="input"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <button className="btn-primary" disabled={loading}>
                    {loading ? "Registering..." : "Create Account"}
                </button>
            </form>
            <h1 className="mt-5 text-white text-center">
                Already have an account?{" "}
                <Link className="text-indigo-400 font-semibold" to={"/login"}>
                    Login here
                </Link>
            </h1>
        </div>
    );
};

export default Register;
