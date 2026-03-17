const StatusDistribution = ({ data }) => {
    const ALL_STATUSES = ["todo", "in-progress", "review", "done"];

    const backendMap = {};
    data.forEach((item) => {
        const key = item.status || item._id;
        backendMap[key] = item.count;
    });

    const normalizedData = ALL_STATUSES.map((status) => ({
        status,
        count: backendMap[status] || 0,
    }));

    const total =
        normalizedData.reduce((sum, item) => sum + item.count, 0) || 1;

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>

            {normalizedData.length === 0 && (
                <p className="text-white/50 text-sm">No tasks available</p>
            )}

            {normalizedData.map(({ status, count }) => {
                const percent = Math.round((count / total) * 100);

                return (
                    <div key={status} className="mb-4">
                        <div className="flex justify-between text-sm mb-1 capitalize">
                            <span>{status.replace("-", " ")}</span>
                            <span>{count}</span>
                        </div>

                        <div className="w-full bg-white/10 h-2 rounded-full">
                            <div
                                className="h-2 rounded-full bg-indigo-500 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default StatusDistribution;