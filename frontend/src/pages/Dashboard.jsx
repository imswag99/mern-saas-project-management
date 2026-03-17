import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/dashboard/StatCard";
import TasksTrend from "../components/dashboard/TasksTrend";
import StatusDistribution from "../components/dashboard/StatusDistribution";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import StatusChart from "../components/dashboard/StatusChart";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalProjects: 0,
            totalTasks: 0,
            completedTasks: 0,
            overdue: 0,
        },
        statusDistribution: [],
        tasksOverTime: [],
        upcomingTasks: []
    });

    const load = async () => {
        const dashboardRes = await api.get("/dashboard/user");
        setDashboardData(dashboardRes.data);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 text-white">
            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <StatCard
                    title="Projects"
                    value={dashboardData.stats.totalProjects}
                    color="text-indigo-400"
                />

                <StatCard
                    title="Total Tasks"
                    value={dashboardData.stats.totalTasks}
                    color="text-purple-400"
                />

                <StatCard
                    title="Completed"
                    value={dashboardData.stats.completedTasks}
                    color="text-green-400"
                />

                <StatCard
                    title="Overdue"
                    value={dashboardData.stats.overdue}
                    color="text-red-400"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <StatusChart data={dashboardData.statusDistribution} />
                <TasksTrend data={dashboardData.tasksOverTime} />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <StatusDistribution data={dashboardData.statusDistribution} />
                <UpcomingTasks tasks={dashboardData.upcomingTasks} />
            </div>
        </div>
    );
};

export default Dashboard;
