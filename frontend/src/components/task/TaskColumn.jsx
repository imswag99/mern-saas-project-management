import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const TaskColumn = ({ status, tasks, onClick }) => {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div
            ref={setNodeRef}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 min-h-125"
        >
            <h3 className="font-semibold capitalize mb-4 text-white/80">
                {status.replace("-", " ")}
            </h3>

            <SortableContext
                items={tasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.length === 0 ? (
                    <div className="text-gray-400 h-20 border-dotted border-3 border-white rounded-xl" />
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={onClick}
                            />
                        ))}
                    </div>
                )}
            </SortableContext>
        </div>
    );
}

export default TaskColumn;