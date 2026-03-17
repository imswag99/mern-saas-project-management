import { motion } from "framer-motion";

const TopPerformers = ({ data }) => {
    return (
        <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-white/60">
                        <tr>
                            <th className="text-left pb-2">Name</th>
                            <th className="text-left pb-2">Total Tasks</th>
                            <th className="text-left pb-2">Completion %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 5).map((user) => (
                            <motion.tr
                                key={user.userId}
                                className="border-t border-white/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <td className="py-2">{user.name}</td>
                                <td>{user.totalTasks}</td>
                                <td>{user.completionRate.toFixed(1)}%</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

export default TopPerformers;