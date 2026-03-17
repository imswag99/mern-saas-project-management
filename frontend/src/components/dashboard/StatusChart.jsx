import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

const StatusChart = ({ data }) => {
    if (!data || data.length === 0)
        return <div className="text-gray-400">No data available</div>;

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

    const formattedData = normalizedData.map(({status, count}, index) => ({
        name: status,
        value: count,
        fill: COLORS[index % COLORS.length],
    }));

    return (
        <div className="bg-[#1f1f2e] p-6 rounded-2xl shadow-xl border border-[#2a2a3a]">
            <h2 className="text-xl font-semibold mb-6 text-white">
                Task Status
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={85}
                        outerRadius={120}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatusChart;
