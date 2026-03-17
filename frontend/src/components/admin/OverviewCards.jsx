import { motion } from "framer-motion";

const OverviewCards = ({ overview }) => {
    const cards = [
        { label: "Total Users", value: overview.totalUsers },
        { label: "Total Projects", value: overview.totalProjects },
        { label: "Total Tasks", value: overview.totalTasks },
        { label: "Completed Tasks", value: overview.completedTasks },
        { label: "Pending Tasks", value: overview.pendingTasks },
        { label: "Completion Rate", value: `${overview.completionRate}%` },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {cards.map((card) => (
                <motion.div
                    key={card.label}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <p className="text-sm text-white/60">{card.label}</p>
                    <h2 className="text-2xl font-bold mt-2">{card.value}</h2>
                </motion.div>
            ))}
        </div>
    );
}

export default OverviewCards;