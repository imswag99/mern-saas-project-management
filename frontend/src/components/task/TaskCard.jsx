import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../../context/AuthContext";

const priorityColors = {
    low: "bg-green-500/30 text-green-300",
    medium: "bg-yellow-500/30 text-yellow-300",
    high: "bg-red-500/30 text-red-300",
};

const TaskCard = ({ task, onClick }) => {
    const { user } = useAuth();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        willChange: "transform",
    };

    const canDrag =
        user.role === "admin" ||
        task.assignedTo?._id === user.id ||
        task.assignedTo === user.id;

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onClick(task)}
            className="bg-black/40 rounded-xl p-4 border border-white/10 shadow-lg hover:bg-black/50 transition cursor-pointer"
        >
            {canDrag && (
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-white/30 text-sm mb-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    ⠿
                </div>
            )}

            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm">{task.title}</h3>
                <span
                    className={`px-2 py-1 text-xs rounded ${
                        priorityColors[task.priority]
                    }`}
                >
                    {task.priority}
                </span>
            </div>

            <p className="text-xs text-white/50 mt-2 line-clamp-2">
                {task.description}
            </p>

            <div className="flex justify-between items-center mt-3 text-xs text-white/40">
                <span className="capitalize">{task.assignedTo?.name}</span>

                {task.dueDate && (
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                )}
            </div>
        </div>
    );
}

export default memo(TaskCard);
