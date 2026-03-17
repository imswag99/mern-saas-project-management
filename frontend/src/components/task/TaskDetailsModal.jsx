import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEdit2, FiTrash2, FiSend } from "react-icons/fi";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
});

const TaskDetailsModal = ({ task, isOpen, onClose, setTasks }) => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const bottomRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
        labels: "",
    });

    const priorityColors = {
        low: "bg-green-500/30 text-green-300",
        medium: "bg-yellow-500/30 text-yellow-300",
        high: "bg-red-500/30 text-red-300",
    };

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "low",
                dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                labels: task.labels?.join(", ") || "",
            });

            setEditing(false);
        }
    }, [task]);

    useEffect(() => {
        if (!task?._id || !isOpen) return;

        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments/${task._id}`);
                setComments(res.data.comments);
            } catch (err) {
                console.log(err);
            }
        };

        fetchComments();

        socket.emit("joinTaskRoom", task._id);

        return () => {
            socket.emit("leaveTaskRoom", task._id);
        };
    }, [task, isOpen]);

    useEffect(() => {
        socket.on("receiveComment", (comment) => {
            setComments((prev) => [...prev, comment]);
        });

        socket.on("commentDeleted", (commentId) => {
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        });

        return () => {
            socket.off("receiveComment");
            socket.off("commentDeleted");
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    if (!isOpen || !task) return null;

    const canModify =
        user.role === "admin" ||
        task.assignedTo?._id === user.id ||
        task.assignedTo === user.id;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveEdit = async () => {
        const payload = {
            ...form,
            labels: form.labels
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean),
        };

        try {
            await api.patch(`/tasks/${task._id}`, payload);

            setTasks((prev) =>
                prev.map((t) =>
                    t._id === task._id ? { ...t, ...payload } : t,
                ),
            );

            setEditing(false);
            onClose();
        } catch (error) {
            console.log(error);
            alert("Update failed");
        }
    };

    const deleteTask = async () => {
        const confirmDelete = window.confirm("Delete this task?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/tasks/${task._id}`);

            setTasks((prev) => prev.filter((t) => t._id !== task._id));
            onClose();
        } catch {
            alert("Delete failed");
        }
    };

    const sendComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await api.post("/comments", {
                taskId: task._id,
                content: newComment,
            });

            socket.emit("sendComment", res.data.populatedComment);

            setNewComment("");
        } catch (err) {
            console.log(err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);

            socket.emit("deleteComment", {
                commentId,
                taskId: task._id,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleCommentKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendComment();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && task && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="
                            w-full max-w-2xl h-[90vh] flex flex-col
                            bg-linear-to-br from-indigo-950 to-slate-900 border border-white/10 shadow-2xl rounded-2xl p-6 md:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">
                                    Task Details
                                </h2>

                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={onClose}
                                    className="text-white/50 hover:text-white"
                                >
                                    <FiX size={20} />
                                </motion.button>
                            </div>

                            <motion.div
                                key={editing ? "edit" : "view"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {!editing ? (
                                    <>
                                        <h1 className="text-2xl font-bold text-white mb-2">
                                            {task.title}
                                        </h1>

                                        <p className="text-white/60 mb-4">
                                            {task.description}
                                        </p>

                                        {task.labels?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {task.labels.map((label) => (
                                                    <span
                                                        key={label}
                                                        className="text-xs px-3 py-1 
                                                    bg-indigo-500/20 text-indigo-300
                                                    rounded-full border border-indigo-400/20"
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-sm text-white/50 mb-6">
                                            <span
                                                className={`px-2 py-1 capitalize rounded ${
                                                    priorityColors[
                                                        task.priority
                                                    ]
                                                }`}
                                            >
                                                {task.priority}
                                            </span>

                                            {task.dueDate && (
                                                <span>
                                                    {new Date(
                                                        task.dueDate,
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {canModify && (
                                            <div className="flex gap-4 mb-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() =>
                                                        setEditing(true)
                                                    }
                                                    className="flex items-center gap-2 
                                                bg-indigo-700 hover:bg-indigo-700
                                                px-4 py-2 rounded-xl text-sm"
                                                >
                                                    <FiEdit2 size={14} />
                                                    Edit
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={deleteTask}
                                                    className="flex items-center gap-2 
                                                bg-red-400 hover:bg-red-700
                                                px-4 py-2 rounded-xl text-sm"
                                                >
                                                    <FiTrash2 size={14} />
                                                    Delete
                                                </motion.button>
                                            </div>
                                        )}

                                        <div className="mt-6 border-t border-white/10 pt-4">
                                            <h3 className="text-lg text-white mb-2">
                                                Comments
                                            </h3>

                                            <div className="space-y-4 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
                                                {comments.map((comment) => (
                                                    <div
                                                        key={comment._id}
                                                        className="bg-white/5 p-3 rounded-xl border border-white/10"
                                                    >
                                                        <div className="flex justify-between text-xs text-white/50 mb-1">
                                                            <span>
                                                                {
                                                                    comment.user
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span>
                                                                {new Date(
                                                                    comment.createdAt,
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        <p className="text-white/80 text-sm">
                                                            {comment.content}
                                                        </p>

                                                        {comment.user?._id ===
                                                            user.id && (
                                                            <button
                                                                onClick={() =>
                                                                    deleteComment(
                                                                        comment._id,
                                                                    )
                                                                }
                                                                className="text-red-400 text-xs mt-2"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <div ref={bottomRef} />
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                <input
                                                    value={newComment}
                                                    onChange={(e) =>
                                                        setNewComment(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={
                                                        handleCommentKeyDown
                                                    }
                                                    placeholder="Write a comment..."
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none"
                                                />
                                                <button
                                                    onClick={sendComment}
                                                    className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-xl flex items-center"
                                                >
                                                    <FiSend />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <input
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 
                                        border border-white/10
                                        focus:border-indigo-500
                                        focus:ring-2 focus:ring-indigo-500/30
                                        outline-none
                                        p-3 rounded-xl text-white"
                                        />

                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full bg-black/40 
                                        border border-white/10
                                        focus:border-indigo-500
                                        focus:ring-2 focus:ring-indigo-500/30
                                        outline-none
                                        p-3 rounded-xl text-white"
                                        />

                                        <select
                                            name="priority"
                                            value={form.priority}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 p-2 rounded-xl text-white border border-white/10"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                        </select>

                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={form.dueDate}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 p-2 rounded-xl text-white border border-white/10"
                                        />

                                        <input
                                            name="labels"
                                            value={form.labels}
                                            onChange={handleChange}
                                            placeholder="Comma separated labels"
                                            className="w-full bg-black/40 p-2 rounded-xl text-white border border-white/10"
                                        />

                                        <div className="flex gap-3 mt-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={saveEdit}
                                                className="bg-indigo-600 px-4 py-2 rounded-xl text-sm"
                                            >
                                                Save
                                            </motion.button>

                                            <button
                                                onClick={() =>
                                                    setEditing(false)
                                                }
                                                className="text-white/50 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default TaskDetailsModal;