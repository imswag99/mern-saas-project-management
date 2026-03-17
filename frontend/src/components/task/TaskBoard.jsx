import {
    DndContext,
    rectIntersection,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState, useMemo } from "react";
import TaskColumn from "./TaskColumn";
import TaskDetailsModal from "./TaskDetailsModal";
import api from "../../services/api";
import CreateTaskModal from "./CreateTaskModal";

const statuses = ["todo", "in-progress", "review", "done"];

const TaskBoard = ({ projectId, members }) => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        search: "",
        sortBy: "",
        order: "asc",
        page: 1,
        limit: 50,
    });

    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setFilters((prev) => ({
                ...prev,
                search: searchInput,
                page: 1,
            }));
        }, 400);

        return () => clearTimeout(delay);
    }, [searchInput]);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);

            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const res = await api.get(
                `/tasks/project/${projectId}?${queryParams.toString()}`,
            );

            setTasks(res.data.tasks);
            setLoading(false);
        };

        fetchTasks();
    }, [projectId, filters]);

    const findContainer = (id) => {
        if (statuses.includes(id)) return id;

        const task = tasks.find((t) => t._id === id);
        return task?.status;
    };

    const handleDragStart = ({ active }) => {
        const task = tasks.find((t) => t._id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = async ({ active, over }) => {
        setActiveTask(null);
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer) return;

        if (activeContainer === overContainer) {
            const columnTasks = tasks.filter(
                (t) => t.status === activeContainer,
            );

            const oldIndex = columnTasks.findIndex((t) => t._id === activeId);
            const newIndex = columnTasks.findIndex((t) => t._id === overId);

            const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

            setTasks((prev) => {
                const otherTasks = prev.filter(
                    (t) => t.status !== activeContainer,
                );
                return [...otherTasks, ...newColumnTasks];
            });

            return;
        }

        setTasks((prev) =>
            prev.map((t) =>
                t._id === activeId ? { ...t, status: overContainer } : t,
            ),
        );

        try {
            await api.patch(`/tasks/${activeId}/move`, {
                status: overContainer,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const openTask = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const closeTask = () => {
        setSelectedTask(null);
        setIsDrawerOpen(false);
    };

    const groupedTasks = useMemo(() => {
        const groups = {};
        statuses.forEach((status) => {
            groups[status] = tasks.filter((t) => t.status === status);
        });
        return groups;
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
    );

    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-6">Task Board</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 px-4 py-2 rounded mb-6"
                >
                    + Create Task
                </button>
            </div>

            {showModal && (
                <CreateTaskModal
                    projectId={projectId}
                    members={members}
                    onClose={() => setShowModal(false)}
                    onCreated={(task) => setTasks((prev) => [...prev, task])}
                />
            )}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 text-white"
                />

                <select
                    value={filters.status}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            status: e.target.value,
                            page: 1,
                        }))
                    }
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 text-white"
                >
                    <option value="">All Status</option>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            priority: e.target.value,
                            page: 1,
                        }))
                    }
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 text-white"
                >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <select
                    value={filters.sortBy}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value,
                            page: 1,
                        }))
                    }
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 text-white"
                >
                    <option value="">Board Default</option>
                    <option value="dueDate">Due Date</option>
                    <option value="createdAt">Created Date</option>
                    <option value="priority">Priority</option>
                </select>

                <select
                    value={filters.order}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            order: e.target.value,
                        }))
                    }
                    className="px-3 py-2 rounded bg-black/30 border border-white/20 text-white"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {loading && (
                <div className="text-white/50 mb-4">Loading tasks...</div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={(event) => {
                    const { over } = event;
                    if (!over) return;
                    if (statuses.includes(over.id)) {
                        console.log("Over column:", over.id);
                    }
                }}
            >
                <div className="grid md:grid-cols-4 gap-6">
                    {statuses.map((status) => (
                        <TaskColumn
                            key={status}
                            status={status}
                            tasks={groupedTasks[status]}
                            setTasks={setTasks}
                            onClick={openTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/20 shadow-2xl w-64">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-sm">
                                    {activeTask.title}
                                </h3>
                                <span className="text-xs capitalize">
                                    {activeTask.priority}
                                </span>
                            </div>

                            <p className="text-xs text-white/60 mt-2 line-clamp-2">
                                {activeTask.description}
                            </p>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TaskDetailsModal
                task={selectedTask}
                isOpen={isDrawerOpen}
                onClose={closeTask}
                setTasks={setTasks}
            />
        </>
    );
}

export default TaskBoard;