import { useEffect, useState } from "react";
import api from "../../services/api";

const CreateProjectModal = ({ onClose, onCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/users").then((res) => setUsers(res.data.users));
    }, []);

    const toggle = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const create = async () => {
        try {
            setLoading(true);
            setError("");
    
            await api.post("/projects", {
                title,
                description,
                memberIds: selected,
            });
            onCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Create failed");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="pt-32 text-center text-red-400">{error}</div>;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div
                className="bg-white/10 backdrop-blur-xl border border-white/20
      rounded-2xl p-8 w-full max-w-lg text-white"
            >
                <h2 className="text-xl font-bold mb-6">Create Project</h2>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project name"
                    className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/20"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Project description"
                    className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/20"
                />

                <div className="max-h-48 overflow-y-auto space-y-2 mb-6">
                    {users.map((u) => (
                        <label
                            key={u._id}
                            className="flex gap-3 items-center text-sm"
                        >
                            <input
                                type="checkbox"
                                onChange={() => toggle(u._id)}
                            />
                            {u.name} ({u.email})
                        </label>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={create}
                        className="flex-1 py-3 rounded-lg bg-indigo-500"
                        disabled={loading}
                    >
                        { loading? "Creating..." : "Create Project"}
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg bg-white/20"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
