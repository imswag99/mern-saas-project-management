import { useState } from "react";
import api from "../../services/api";

const CreateTaskModal = ({
    projectId,
    members,
    onClose,
    onCreated,
}) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        assignedTo: "",
        labels: [],
    });

    const [customLabel, setCustomLabel] = useState("");

    const labelOptions = [
        "feature",
        "bug",
        "research",
        "backend",
        "frontend",
        "api",
        "database",
        "authentication",
        "authorization",
        "security",
        "performance",
        "scalability",
        "ui/ux",
        "responsive",
        "deployment",
        "ci-cd",
        "cloud",
        "testing",
        "documentation",
        "maintenance",
        "support",
    ];

    const toggleLabel = (label) => {
        setForm((prev) => ({
            ...prev,
            labels: prev.labels.includes(label)
                ? prev.labels.filter((l) => l !== label)
                : [...prev.labels, label],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await api.post("/tasks", {
            ...form,
            projectId,
            assignedTo: form.assignedTo || null,
        });

        onCreated(res.data.task);
        onClose();
    };

    const addCustomLabel = () => {
        const labels = customLabel
            .split(",")
            .map((l) => l.trim().toLowerCase())
            .filter(Boolean);

        if (labels.length === 0) return;

        setForm((prev) => ({
            ...prev,
            labels: [...new Set([...prev.labels, ...labels])],
        }));

        setCustomLabel("");
    };

    const handleLabelKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCustomLabel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-105 space-y-4 text-white"
            >
                <h2 className="text-xl font-bold">Create Task</h2>

                <input
                    placeholder="Title"
                    required
                    className="w-full p-2 rounded bg-black/40"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <textarea
                    placeholder="Description"
                    className="w-full p-2 rounded bg-black/40"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <select
                    className="w-full p-2 rounded bg-black/40"
                    value={form.priority}
                    onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                    }
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <input
                    type="date"
                    className="w-full p-2 rounded bg-black/40"
                    value={form.dueDate}
                    onChange={(e) =>
                        setForm({ ...form, dueDate: e.target.value })
                    }
                />

                <select
                    className="w-full p-2 rounded bg-black/40"
                    value={form.assignedTo}
                    onChange={(e) =>
                        setForm({ ...form, assignedTo: e.target.value })
                    }
                >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                        <option key={member.user._id} value={member.user._id}>
                            {member.user.name}
                        </option>
                    ))}
                </select>

                <div>
                    <div className="text-sm mb-2">Labels</div>
                    <div className="flex flex-wrap gap-2">
                        {labelOptions.map((label) => (
                            <button
                                type="button"
                                key={label}
                                onClick={() => toggleLabel(label)}
                                className={`px-3 py-1 rounded-full text-xs ${
                                    form.labels.includes(label)
                                        ? "bg-indigo-600"
                                        : "bg-white/10"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 mt-3">
                    <input
                        placeholder="Add custom label"
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        onKeyDown={handleLabelKeyDown}
                        className="flex-1 p-2 rounded bg-black/40 text-sm"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="bg-indigo-600 px-4 py-2 rounded"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTaskModal;