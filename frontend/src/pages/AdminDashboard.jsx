import { useEffect, useState } from "react";
import OverviewCards from "../components/admin/OverviewCards";
import AdminStatusChart from "../components/admin/AdminStatusChart";
import TasksTrendChart from "../components/admin/TasksTrendChart";
import TopPerformers from "../components/admin/TopPerformers";
import api from "../services/api";

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const fetchDashboard = async () => {
        const res = await api.get("/dashboard/admin");
        setData(res.data);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (!data) return <div className="text-white p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6 text-white">
            <OverviewCards overview={data.overview} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminStatusChart data={data.statusDistribution} />
                <TasksTrendChart data={data.tasksOverTime} />
            </div>

            <TopPerformers data={data.tasksPerUser} />
        </div>
    );
};

export default AdminDashboard;
