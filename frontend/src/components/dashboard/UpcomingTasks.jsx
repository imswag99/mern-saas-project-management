const UpcomingTasks = ({ tasks }) => {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>

            {tasks.length === 0 && (
                <p className="text-white/50 text-sm">No upcoming deadlines</p>
            )}

            {tasks.map((task) => (
                <div
                    key={task._id}
                    className="flex justify-between text-sm mb-3"
                >
                    <span>{task.title}</span>
                    <span className="text-white/50">
                        {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default UpcomingTasks;