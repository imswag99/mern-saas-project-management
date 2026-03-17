import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const AdminStatusChart = ({ data }) => {
    const ALL_STATUSES = ["todo", "in-progress", "review", "done"];
    const map = {};
    data.forEach((item) => {
        map[item.status] = item.count;
    });
    const normalized = ALL_STATUSES.map((status) => ({
        status,
        count: map[status] || 0,
    }));

    return (
        <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <h3 className="text-lg font-semibold mb-4">
                System Status Distribution
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={normalized}>
                    <XAxis dataKey="status" tick={{ fill: "white" }} />
                    <YAxis tick={{ fill: "white" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

export default AdminStatusChart;