import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const TasksTrend = ({ data }) => {
    if (!data || data.length === 0)
        return <div className="text-gray-400">No data</div>;

    return (
        <div className="bg-[#1f1f2e] p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
                Productivity Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id="colorTasks"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#6366f1"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#6366f1"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" />
                    <XAxis dataKey="_id" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111827",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorTasks)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TasksTrend;