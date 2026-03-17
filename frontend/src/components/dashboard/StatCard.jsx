import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const StatCard = ({ title, value, color }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 800; // ms
        const increment = value / (duration / 16);

        const counter = setInterval(() => {
            start += increment;
            if (start >= value) {
                start = value;
                clearInterval(counter);
            }
            setDisplayValue(Math.floor(start));
        }, 16);

        return () => clearInterval(counter);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
                y: -6,
                scale: 1.03,
                boxShadow: "0px 10px 30px rgba(99,102,241,0.25)",
            }}
            className="bg-[#1f1f2e] p-6 rounded-2xl border border-[#2a2a3a] shadow-lg cursor-pointer"
        >
            <p className="text-gray-400 text-sm mb-2">{title}</p>

            <h2 className={`text-3xl font-bold tracking-tight ${color}`}>
                {displayValue}
            </h2>
        </motion.div>
    );
}

export default StatCard;