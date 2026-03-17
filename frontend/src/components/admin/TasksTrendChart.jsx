import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const TasksTrendChart = ({ data }) => {
    const chartData = data.map((d) => ({ month: d.month, count: d.count }));

    return (
        <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h3 className="text-lg font-semibold mb-4">Tasks Over Time</h3>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                    <XAxis dataKey="month" tick={{ fill: "white" }} />
                    <YAxis tick={{ fill: "white" }} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10B981"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

export default TasksTrendChart;