import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
            <motion.div
                className="w-16 h-16 rounded-full border-4 border-indigo-400 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p className="mt-6 text-sm opacity-70 tracking-wide">
                Loading…
            </p>
        </div>
    );
};

export default Loader;
